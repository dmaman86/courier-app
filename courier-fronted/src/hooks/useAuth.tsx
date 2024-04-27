import React, { createContext, useContext, useEffect, useMemo } from "react";

import { Token } from '../types';
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services";

interface AuthContextType {
    tokens: Token | null;
    saveTokens: (tokens: Token) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
const isTokenExpired = (token: string) => {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode the payload of the token
      return Date.now() >= exp * 1000; // compare the current time with the expiration time
    } catch {
      return true; // assume the token is expired if there is an error
    }
  };


export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [ tokens, setTokens, removeStoredValue ] = useLocalStorage('auth-token', null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = async () => {
            if (tokens){
                const accessTokenExpired = isTokenExpired(tokens.accessToken);
                const refreshTokenExpired = isTokenExpired(tokens.refreshToken);

                if(!accessTokenExpired) return;

                if(accessTokenExpired && !refreshTokenExpired){
                    const newTokens = await AuthService.refreshToken(tokens.refreshToken);
                    if(newTokens){
                        setTokens(newTokens);
                        return;
                    }
                }
                logout();
            }
        };
        checkTokenExpiration();
    }, [tokens])

    const saveTokens = (data: Token) => {
        setTokens(data);
    }

    const logout = () => {
        removeStoredValue();
        navigate('/login', { replace: true });
    }

    const value = useMemo(() => ({
        tokens,
        saveTokens,
        logout
    }), [tokens]);


    return <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>;

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}