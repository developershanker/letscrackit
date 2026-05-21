import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import healthReducer from './slices/healthSlice';
import tipsReducer from './slices/tipsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  health: healthReducer,
  tips: tipsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
