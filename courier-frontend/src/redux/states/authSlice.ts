import { AuthState } from "@/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  id: null,
  email: null,
  fullName: null,
  phoneNumber: null,
  roles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.phoneNumber = action.payload.phoneNumber;
      state.roles = action.payload.roles;
    },
    clearAuth: () => initialState,
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
