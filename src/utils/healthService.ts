import { Platform } from 'react-native';
import dayjs from 'dayjs';

export interface HealthData {
  steps?: number;
  weight?: number;   // kg
  height?: number;   // cm
  heartRate?: number; // bpm (average today)
  sleep?: number;    // hours (last night)
}

// ─── Android (Health Connect) ────────────────────────────────────────────────

async function initAndroid(): Promise<boolean> {
  const {
    getSdkStatus,
    initialize,
    requestPermission,
    SdkAvailabilityStatus,
  } = require('react-native-health-connect');

  const status = await getSdkStatus();
  if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
    return false;
  }

  const ok = await initialize();
  if (ok) {
    await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'SleepSession' },
    ]);
  }
  return ok;
}

async function readAndroidHealth(): Promise<HealthData> {
  const { readRecords, aggregateRecord } = require('react-native-health-connect');
  const now = dayjs();
  const startOfDay   = now.startOf('day').format();
  const nowISO       = now.format();
  const yesterday8pm = now.subtract(1, 'day').hour(20).minute(0).second(0).millisecond(0).format();

  const result: HealthData = {};

  try {
    const agg = await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: { operator: 'between', startTime: startOfDay, endTime: nowISO },
    });
    if (agg.COUNT_TOTAL !== undefined) {
      result.steps = agg.COUNT_TOTAL;
    }
  } catch {}

  // Use readRecords for HeartRate — aggregateRecord COUNT_TOTAL counts records, not BPM
  try {
    const hrData = await readRecords('HeartRate', {
      timeRangeFilter: { operator: 'between', startTime: startOfDay, endTime: nowISO },
    });
    const allSamples = (hrData.records ?? []).flatMap((r: any) => r.samples ?? []);
    if (allSamples.length > 0) {
      result.heartRate = Math.round(
        allSamples.reduce((s: number, x: any) => s + x.beatsPerMinute, 0) / allSamples.length,
      );
    }
  } catch {}

  try {
    const agg = await aggregateRecord({
      recordType: 'SleepSession',
      timeRangeFilter: { operator: 'between', startTime: yesterday8pm, endTime: nowISO },
    });
    if (agg.SLEEP_DURATION_TOTAL !== undefined) {
      result.sleep = Math.round((agg.SLEEP_DURATION_TOTAL / 3_600_000) * 10) / 10;
    }
  } catch {}

  return result;
}

// ─── iOS (HealthKit) ─────────────────────────────────────────────────────────

function initIOS(): Promise<boolean> {
  return new Promise(resolve => {
    const AppleHealthKit = require('react-native-health');
    if (!AppleHealthKit?.initHealthKit) {
      console.warn('[HealthKit] Native module not available - NativeModules.AppleHealthKit is undefined');
      resolve(false);
      return;
    }
    const { Permissions } = AppleHealthKit.Constants;
    AppleHealthKit.initHealthKit(
      {
        permissions: {
          read: [
            Permissions.StepCount,
            Permissions.HeartRate,
            Permissions.SleepAnalysis,
          ],
          write: [],
        },
      },
      (err: string) => {
        if (err) console.warn('[HealthKit] initHealthKit error:', err);
        resolve(!err);
      },
    );
  });
}

function iosRead<T>(fn: Function, opts: object): Promise<T | null> {
  return new Promise(resolve => {
    fn(opts, (err: string, res: T) => resolve(err ? null : res));
  });
}

// Sleep stage values that represent actual sleep (not just time in bed / awake)
// iOS < 16: 'ASLEEP'
// iOS 16+: 'CORE' (light), 'DEEP', 'REM', 'UNSPECIFIED'
const SLEEP_STAGES = new Set(['ASLEEP', 'CORE', 'DEEP', 'REM', 'UNSPECIFIED']);

async function readIOSHealth(): Promise<HealthData> {
  const AppleHealthKit = require('react-native-health');
  const result: HealthData = {};
  const now = dayjs();
  const startOfDay   = now.startOf('day').format();
  const nowISO       = now.format();
  const yesterday6pm = now.subtract(1, 'day').hour(18).minute(0).second(0).millisecond(0).format();

  try {
    const steps = await iosRead<{ value: number }>(
      AppleHealthKit.getStepCount.bind(AppleHealthKit),
      { date: startOfDay },
    );
    if (steps) result.steps = Math.round(steps.value);
  } catch {}

  try {
    const samples = await iosRead<Array<{ value: number }>>(
      AppleHealthKit.getHeartRateSamples.bind(AppleHealthKit),
      { startDate: startOfDay, endDate: nowISO, ascending: false, limit: 20 },
    );
    if (samples && samples.length > 0) {
      result.heartRate = Math.round(
        samples.reduce((s, x) => s + x.value, 0) / samples.length,
      );
    }
  } catch {}

  try {
    const sleep = await iosRead<Array<{ startDate: string; endDate: string; value: string }>>(
      AppleHealthKit.getSleepSamples.bind(AppleHealthKit),
      { startDate: yesterday6pm, endDate: nowISO, limit: 50 },
    );
    if (sleep && sleep.length > 0) {
      // Prefer specific sleep stages (iOS 16+); fall back to INBED if none available
      let sleepSamples = sleep.filter(s => SLEEP_STAGES.has(s.value));
      if (sleepSamples.length === 0) {
        sleepSamples = sleep.filter(s => s.value === 'INBED');
      }
      if (sleepSamples.length > 0) {
        const totalMs = sleepSamples.reduce(
          (sum, s) => sum + (new Date(s.endDate).getTime() - new Date(s.startDate).getTime()),
          0,
        );
        result.sleep = Math.round((totalMs / 3_600_000) * 10) / 10;
      }
    }
  } catch {}

  return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function initHealthService(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') return await initAndroid();
    if (Platform.OS === 'ios') return await initIOS();
    return false;
  } catch {
    return false;
  }
}

export async function readHealthData(): Promise<HealthData> {
  try {
    if (Platform.OS === 'android') return await readAndroidHealth();
    if (Platform.OS === 'ios') return await readIOSHealth();
    return {};
  } catch {
    return {};
  }
}
