import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { Token, User } from '../types';
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useFetch } from "./useFetch";
import { paths } from "../helpers/paths";

interface AuthContextType {
    tokens: Token | null;
    userDetails: User | null;
    error: string | null;
    saveTokens: (tokens: Token) => void;
    logout: () => void;
    navigateToErrorPage: () => void;
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
    const [ userDetails, setUserDetails ] = useState<User | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const { data, loading, error: errorResponse, updateUrl, updateOptions } = useFetch();

    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = async () => {
            if (tokens){
                const accessTokenExpired = isTokenExpired(tokens.accessToken);
                const refreshTokenExpired = isTokenExpired(tokens.refreshToken);

                if(!accessTokenExpired){
                    if(!userDetails){
                        updateUrl(paths.courier.userDetails);
                    }
                    return;
                }

                if(accessTokenExpired && !refreshTokenExpired){
                    updateUrl(paths.courier.refreshToken);
                    updateOptions({
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${tokens.refreshToken}`
                        }
                    });
                    return;
                }
                logout();
            }
        };
        checkTokenExpiration();
    }, [tokens]);

    useEffect(() => {
        if(!loading){
            if(!errorResponse && data){
                if(isTokens(data)) setTokens(data);
                else if(isUser(data)) setUserDetails(data);
                setError(null);
            }else{
                setError(errorResponse?.message || null);
            }
        }
    }, [data, loading, errorResponse]);

    const saveTokens = (data: Token) => {
        setTokens(data);
    }

    const logout = () => {
        removeStoredValue();
        setUserDetails(null);
        setError(null);
        navigate('/login', { replace: true });
    }

    const navigateToErrorPage = () => {
        navigate('/error', { replace: true });
    }

    const isUser = (data: unknown): data is User => {
        return (data as User) && (data as User).id !== undefined;
    }

    const isTokens = (data: unknown): data is Token => {
        return (data as Token) && (
            (data as Token).accessToken !== undefined
            && (data as Token).refreshToken !== undefined);
    }

    const value = useMemo(() => ({
        tokens,
        userDetails,
        error,
        saveTokens,
        logout,
        navigateToErrorPage
    }), [tokens, userDetails, error]);


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