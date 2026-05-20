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

  // Check if Health Connect is available on this device before anything else
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
      { accessType: 'read', recordType: 'Weight' },
      { accessType: 'read', recordType: 'Height' },
    ]);
  }
  return ok;
}

async function readAndroidHealth(): Promise<HealthData> {
  const { readRecords, aggregateRecord } = require('react-native-health-connect');
  const now = dayjs();
  const startOfDay   = now.startOf('day').format();                                   // e.g. 2026-05-20T00:00:00+05:30
  const nowISO       = now.format();
  const oneYearAgo   = now.subtract(1, 'year').format();
  const yesterday8pm = now.subtract(1, 'day').hour(20).minute(0).second(0).millisecond(0).format();

  const result: HealthData = {};

  try {
    const agg = await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: { operator: 'between', startTime: startOfDay, endTime: nowISO },
      dataOriginFilter: ['com.samsung.health'],
    });
    if (agg.COUNT_TOTAL !== undefined) {
      result.steps = agg.COUNT_TOTAL;
    }
  } catch {}

  try {
    const agg = await aggregateRecord({
      recordType: 'HeartRate',
      timeRangeFilter: { operator: 'between', startTime: startOfDay, endTime: nowISO },
    });
    if (agg.COUNT_TOTAL !== undefined) {
      result.steps = agg.COUNT_TOTAL;
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

  try {
    const { records } = await readRecords('Weight', {
      timeRangeFilter: { operator: 'between', startTime: oneYearAgo, endTime: nowISO },
    });
    if (records.length > 0) {
      const latest = records[records.length - 1];
      result.weight = Math.round(latest.weight.inKilograms * 10) / 10;
    }
  } catch {}

  try {
    const { records } = await readRecords('Height', {
      timeRangeFilter: { operator: 'between', startTime: oneYearAgo, endTime: nowISO },
    });
    if (records.length > 0) {
      const latest = records[records.length - 1];
      result.height = Math.round(latest.height.inMeters * 100);
    }
  } catch {}

  return result;
}

// ─── iOS (HealthKit) ─────────────────────────────────────────────────────────

function initIOS(): Promise<boolean> {
  return new Promise(resolve => {
    const AppleHealthKit = require('react-native-health');
    const { Permissions } = AppleHealthKit.Constants;
    AppleHealthKit.initHealthKit(
      {
        permissions: {
          read: [
            Permissions.StepCount,
            Permissions.HeartRate,
            Permissions.SleepAnalysis,
            Permissions.Weight,
            Permissions.Height,
          ],
          write: [],
        },
      },
      (err: string) => resolve(!err),
    );
  });
}

function iosRead<T>(fn: Function, opts: object): Promise<T | null> {
  return new Promise(resolve => {
    fn(opts, (err: string, res: T) => resolve(err ? null : res));
  });
}

async function readIOSHealth(): Promise<HealthData> {
  const AppleHealthKit = require('react-native-health');
  const result: HealthData = {};
  const now = dayjs();
  const startOfDay    = now.startOf('day').format();
  const nowISO        = now.format();
  const yesterday6pm  = now.subtract(1, 'day').hour(18).minute(0).second(0).millisecond(0).format();

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
      result.heartRate = Math.round(samples.reduce((s, x) => s + x.value, 0) / samples.length);
    }
  } catch {}

  try {
    const sleep = await iosRead<Array<{ startDate: string; endDate: string; value: string }>>(
      AppleHealthKit.getSleepSamples.bind(AppleHealthKit),
      { startDate: yesterday6pm, endDate: nowISO, limit: 20 },
    );
    if (sleep && sleep.length > 0) {
      const asleep = sleep.filter(s => s.value === 'ASLEEP' || s.value === 'INBED');
      if (asleep.length > 0) {
        const totalMs = asleep.reduce(
          (sum, s) => sum + (new Date(s.endDate).getTime() - new Date(s.startDate).getTime()),
          0,
        );
        result.sleep = Math.round((totalMs / 3_600_000) * 10) / 10;
      }
    }
  } catch {}

  try {
    const weight = await iosRead<{ value: number }>(
      AppleHealthKit.getLatestWeight.bind(AppleHealthKit),
      { unit: 'gram' },
    );
    if (weight) result.weight = Math.round((weight.value / 1000) * 10) / 10;
  } catch {}

  try {
    const height = await iosRead<{ value: number }>(
      AppleHealthKit.getLatestHeight.bind(AppleHealthKit),
      { unit: 'meter' },
    );
    if (height) result.height = Math.round(height.value * 100);
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
