import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';


import { AuthContextType, Token, User, Role } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface MyJwtPayload extends JwtPayload {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    roles: Role[];
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [ tokens, setTokens, removeStoredValue ] = useLocalStorage('auth-token', null);
    const [ userDetails, setUserDetails ] = useState<User | null>(null);

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
        if(tokens && tokens.accessToken){
            const decode = jwtDecode<MyJwtPayload>(tokens.accessToken);
            setUserDetails({
                id: parseInt(decode.id),
                email: decode.email,
                name: decode.name,
                lastName: decode.lastname,
                phone: decode.phone,
                roles: decode.roles
            });
        }
    }, [tokens]);

    const value = useMemo(() => ({
        tokens,
        userDetails,
        saveTokens,
        logout,
    }), [tokens, userDetails, saveTokens, logout]);


    return <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>;

};