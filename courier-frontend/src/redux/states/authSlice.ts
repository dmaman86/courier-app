import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Client } from '@/domain';

import { RootState } from "../store";

interface AuthState {
    userDetails: User | Client | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    userDetails: null,
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | Client | null>) => {
            state.userDetails = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        logout: (state) => {
            state.userDetails = null;
            state.isLoading = false;
        },
    },
});

export const { setUser, setLoading, logout } = authSlice.actions;
export const selectUserDetails = (state: RootState) => state.auth.userDetails;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;

export default authSlice.reducer;