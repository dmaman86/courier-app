import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CustomError, Token, User } from '../types';
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";
import { service } from "../services";
import { paths } from "../helpers";


interface AuthContextType {
    tokens: Token | null;
    userDetails: User | null;
    saveTokens: (tokens: Token) => void;
    logout: () => void;
    error: CustomError | null;
    navigateToErrorPage: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [ tokens, setTokens, removeStoredValue ] = useLocalStorage('auth-token', null);
    const [ userDetails, setUserDetails ] = useState<User | null>(null);
    const [ error, setError ] = useState<CustomError | null>(null);

    const navigate = useNavigate();

    const saveTokens = useCallback((data: Token) => {
        setTokens(data);
    }, [setTokens]);

    const logout = useCallback(() => {
        removeStoredValue();
        setUserDetails(null);
        navigate('/login', { replace: true });
    }, [navigate, removeStoredValue]);

    const navigateToErrorPage = useCallback(() => {
        navigate('/error', { replace: true });
    }, [navigate]);

    const fetchUserDetails = useCallback( async () => {
        if(!tokens || !tokens.accessToken) return;
        try{
            const response = await service.get(paths.courier.userDetails);
            setUserDetails(response.data);
            setError(null);
        }catch(error){
            setUserDetails(null);
            setError(error as CustomError);
        }
    }, [tokens]);

    useEffect(() => {
        if(!userDetails)
            fetchUserDetails();
    }, [fetchUserDetails, userDetails]);

    const value = useMemo(() => ({
        tokens,
        userDetails,
        saveTokens,
        logout,
        navigateToErrorPage,
        error
    }), [tokens, userDetails, saveTokens, logout, navigateToErrorPage, error]);


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