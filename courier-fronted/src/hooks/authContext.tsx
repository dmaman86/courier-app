import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, CustomError, Token, User } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { serviceRequest } from "../services";
import { paths } from "../helpers";
import { useFetchAndLoad } from './useFetchAndLoad';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [ tokens, setTokens, removeStoredValue ] = useLocalStorage('auth-token', null);
    const [ userDetails, setUserDetails ] = useState<User | null>(null);
    const [ error, setError ] = useState<CustomError | null>(null);

    const { callEndPoint } = useFetchAndLoad();

    const navigate = useNavigate();

    const saveTokens = useCallback((data: Token) => {
        setTokens(data);
    }, [setTokens]);

    const logout = useCallback(() => {
        removeStoredValue();
        setUserDetails(null);
        navigate('/login', { replace: true });
    }, [navigate, removeStoredValue]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            
            const result = await callEndPoint(serviceRequest.getItem<User>(paths.courier.userDetails));
            if(!result.error){
                setUserDetails(result.data);
                setError(null);
            }else{
                setUserDetails(null);
                setError(result.error as CustomError);
            }
            
        }
        if(!userDetails && tokens && tokens.accessToken && !error)
            fetchUserDetails();
    }, [tokens, userDetails, callEndPoint, error]);

    const value = useMemo(() => ({
        tokens,
        userDetails,
        saveTokens,
        logout,
        error
    }), [tokens, userDetails, saveTokens, logout, error]);


    return <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>;

};