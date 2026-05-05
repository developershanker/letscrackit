import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  profileComplete: boolean;
  dob: string | null;
  sex: 'male' | 'female' | null;
}

export interface BMIEntry {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  createdAt?: Date;
  method: 'bodyFat' | 'percentile' | 'simple';
  metric: number | null;
  category: string;
  color: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userData: UserData | null;
  userPhysicalData: BMIEntry[] | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  userData: null,
  userPhysicalData: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    setUserData(state, action: PayloadAction<UserData>) {
      state.userData = action.payload;
    },
    setUserPhysicalData(state, action: PayloadAction<BMIEntry[]>) {
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