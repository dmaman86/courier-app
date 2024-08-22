import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Client } from '@/types';

import { RootState } from "../store";

interface AuthState {
    userDetails: User | Client | null;
}

const initialState: AuthState = {
    userDetails: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | Client | null>) => {
            state.userDetails = action.payload;
        },
        logout: (state) => {
            state.userDetails = null;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export const selectUserDetails = (state: RootState) => state.auth.userDetails;

export default authSlice.reducer;