import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HealthState {
  steps?: number;
  heartRate?: number;
  sleep?: number;
  lastFetched?: number;
}

const initialState: HealthState = {};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setHealthData(state, action: PayloadAction<Omit<HealthState, 'lastFetched'>>) {
      return { ...action.payload, lastFetched: Date.now() };
    },
    clearHealthData() {
      return {};
    },
  },
});

export const { setHealthData, clearHealthData } = healthSlice.actions;
export default healthSlice.reducer;
