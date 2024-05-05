import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, CustomError, Token, User } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { service } from "../services";
import { paths } from "../helpers";


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

    useEffect(() => {
        const fetchUserDetails = async () => {
            await service.get(paths.courier.userDetails)
                    .then(response =>{
                        setUserDetails(response.data)
                        setError(null);
                    })
                    .catch(error => {
                        setUserDetails(null);
                        setError(error as CustomError);
                    })
        }


        if(!userDetails && tokens && tokens.accessToken)
            fetchUserDetails();
    }, [tokens, userDetails]);

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}