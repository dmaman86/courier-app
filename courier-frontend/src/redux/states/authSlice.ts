import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token, User, Client } from '@/types';
import { TokenService } from "@/services/token.service";

import { RootState } from "../store";

interface AuthState {
    tokens: Token | null;
    userDetails: User | Client | null;
}

const initialState: AuthState = {
    tokens: TokenService.getToken(),
    userDetails: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Token>) => {
            state.tokens = action.payload;
            TokenService.setToken(action.payload);
        },
        setUser: (state, action: PayloadAction<User | Client>) => {
            state.userDetails = action.payload;
        },
        logout: (state) => {
            state.tokens = null;
            state.userDetails = null;
            TokenService.removeToken();
        },
        updateToken: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
            if(state.tokens){
                state.tokens.accessToken = action.payload.accessToken;
                state.tokens.refreshToken = action.payload.refreshToken;
                TokenService.updateToken(action.payload.accessToken, action.payload.refreshToken);
            }
        },
    },
});

export const { setTokens, setUser, logout, updateToken } = authSlice.actions;

export const selectAuthTokens = (state: RootState) => state.auth.tokens;
export const selectUserDetails = (state: RootState) => state.auth.userDetails;

export default authSlice.reducer;