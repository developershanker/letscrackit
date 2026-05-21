import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TipsState {
  tips: string[];
  entryId: string | null;
}

const initialState: TipsState = {
  tips: [],
  entryId: null,
};

const tipsSlice = createSlice({
  name: 'tips',
  initialState,
  reducers: {
    setHealthTips(state, action: PayloadAction<{ entryId: string; tips: string[] }>) {
      state.entryId = action.payload.entryId;
      state.tips = action.payload.tips;
    },
    clearHealthTips(state) {
      state.tips = [];
      state.entryId = null;
    },
  },
});

export const { setHealthTips, clearHealthTips } = tipsSlice.actions;
export default tipsSlice.reducer;
