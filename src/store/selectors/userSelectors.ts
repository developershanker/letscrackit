// src/store/selectors/userSelectors.ts
import { RootState } from '../index';

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export const selectAuthToken = (state: RootState) => state.user.token;

export const selectUserData = (state: RootState) => state.user.userData;

export const selectUserPhysicalData = (state: RootState) => state.user.userPhysicalData;

export const selectHealthTips = (state: RootState) => state.tips.tips;

export const selectHealthTipsEntryId = (state: RootState) => state.tips.entryId;
