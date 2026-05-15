import { useState, useCallback, useEffect } from 'react';
import { initHealthService, readHealthData, HealthData } from '../utils/healthService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setHealthData } from '../store/slices/healthSlice';
import { AppState, AppStateStatus } from 'react-native';

type Status = 'idle' | 'loading' | 'ready' | 'unavailable';

// to refetch if the data is stale from last 30 mins
const isStale = (lastFetched?: number): boolean => {
  if (!lastFetched) return true;
  if (new Date(lastFetched).toDateString() !== new Date().toDateString()) return true;
  return Date.now() - lastFetched > 30 * 60 * 1000;
};

export function useHealthData() {
  const dispatch = useDispatch();
  const persisted = useSelector((s: RootState) => s.health);

  const hasData =
    persisted.steps !== undefined ||
    persisted.heartRate !== undefined ||
    persisted.sleep !== undefined;

  const [status, setStatus] = useState<Status>(hasData ? 'ready' : 'idle');
  const [data, setData] = useState<HealthData>({
    steps: persisted.steps,
    heartRate: persisted.heartRate,
    sleep: persisted.sleep,
  });

  const load = useCallback(async () => {
    setStatus('loading');
    const ok = await initHealthService();
    if (!ok) {
      setStatus('unavailable');
      return;
    }
    const healthData = await readHealthData();
    console.log('healthData', healthData)
    setData(healthData);
    dispatch(setHealthData(healthData));
    setStatus('ready');
  }, [dispatch]);

  // Auto-refresh when app returns to foreground
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active' && status === 'ready' && isStale(persisted.lastFetched)) {
        load();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [status, persisted.lastFetched, load]);

  // Refresh only if stale — used by screens on focus
  const refresh = useCallback(() => {
    if (status === 'ready' && isStale(persisted.lastFetched)) {
      load();
    }
  }, [status, persisted.lastFetched, load]);

  return { status, data, load, refresh };
}
