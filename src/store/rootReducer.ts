import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import healthReducer from './slices/healthSlice';

const rootReducer = combineReducers({
  user: userReducer,
  health: healthReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
