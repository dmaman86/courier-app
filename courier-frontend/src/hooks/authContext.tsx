import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';


/*import { AuthContextType, Token, User, Role } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTokens, setUserDetails, logout } from '@/redux/states/authSlice';

interface MyJwtPayload extends JwtPayload {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    roles: Role[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { tokens, userDetails } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTokens = localStorage.getItem('auth-token');
        if(storedTokens){
            const { accessToken, refreshToken } = JSON.parse(storedTokens);
            if(accessToken && refreshToken){
                dispatch(setTokens(JSON.parse(storedTokens)));
                const decoded = jwtDecode<MyJwtPayload>(accessToken);
                dispatch(setUserDetails({
                    id: parseInt(decoded.id),
                    email: decoded.email,
                    name: decoded.name,
                    lastName: decoded.lastname,
                    phone: decoded.phone,
                    roles: decoded.roles
                }))
            }
            
        }
    }, []);

    useEffect(() => {
        if(tokens && tokens.accessToken){
            const decoded = jwtDecode<MyJwtPayload>(tokens.accessToken);
            dispatch(setUserDetails({
                id: parseInt(decoded.id),
                email: decoded.email,
                name: decoded.name,
                lastName: decoded.lastname,
                phone: decoded.phone,
                roles: decoded.roles
            }))
        }
    }, [tokens, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    }

    return (
        <AuthContext.Provider value={{ tokens, userDetails, logout: handleLogout }}>
            { children }
        </AuthContext.Provider>
    )
}

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

};*/