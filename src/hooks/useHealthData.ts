import { useState, useCallback } from 'react';
import { initHealthService, readHealthData, HealthData } from '../utils/healthService';

type Status = 'idle' | 'loading' | 'ready' | 'unavailable';

export function useHealthData() {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<HealthData>({});

  const load = useCallback(async () => {
    setStatus('loading');
    const ok = await initHealthService();
    if (!ok) {
      setStatus('unavailable');
      return;
    }
    const healthData = await readHealthData();
    setData(healthData);
    setStatus('ready');
  }, []);

  return { status, data, load };
}
