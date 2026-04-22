// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userData: object | null;
  userPhysicalData: any[] | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  userData: null,
  userPhysicalData: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    setUserData(state, action: PayloadAction<object>) {
      state.userData = action.payload;
    },
    setUserPhysicalData(state, action: PayloadAction<any[]>) {
      state.userPhysicalData = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userData = null;
      state.userPhysicalData = null;
    },
  },
});

export const { setLogin, logout, setUserData, setUserPhysicalData } = userSlice.actions;
export default userSlice.reducer;
