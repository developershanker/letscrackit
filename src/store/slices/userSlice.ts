// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userData: object | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  userData: null
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
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setLogin, logout, setUserData } = userSlice.actions;
export default userSlice.reducer;
