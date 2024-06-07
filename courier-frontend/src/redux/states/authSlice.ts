import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token, User, Role } from '@/types';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { TokenService } from "@/services/token.service";

import { RootState } from "../store";

interface AuthState {
    tokens: Token | null;
    userDetails: User | null;
}

interface MyJwtPayload extends JwtPayload {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    roles: Role[];
}

const getUserDetailsFromToken = (accessToken: string): User | null => {
    try{
        const decoded = jwtDecode<MyJwtPayload>(accessToken);
        return {
            id: parseInt(decoded.id),
            email: decoded.email,
            name: decoded.name,
            lastName: decoded.lastname,
            phone: decoded.phone,
            roles: decoded.roles,
            isActive: true
        }
    }catch(error){
        console.error('Error decoding token: ', error);
        return null;
    }
}

const initialState: AuthState = {
    tokens: TokenService.getToken(),
    userDetails: null
};

if(initialState.tokens && initialState.tokens.accessToken){
    initialState.userDetails = getUserDetailsFromToken(initialState.tokens.accessToken);
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Token>) => {
            state.tokens = action.payload;
            TokenService.setToken(action.payload);
            state.userDetails = getUserDetailsFromToken(action.payload.accessToken);
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

export const { setTokens, logout, updateToken } = authSlice.actions;

export const selectAuthTokens = (state: RootState) => state.auth.tokens;
export const selectUserDetails = (state: RootState) => state.auth.userDetails;

export default authSlice.reducer;