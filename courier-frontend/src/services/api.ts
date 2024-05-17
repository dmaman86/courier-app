import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

import { Token } from "../types";

interface MyJwtPayload extends JwtPayload {
    exp: number;
}

const status = (response: AxiosResponse): Promise<AxiosResponse> => {
    if(response.status >= 200 && response.status < 300){
        return Promise.resolve(response);
    }

    return Promise.reject(response);
}

const isTokenExpired = (token: string): boolean => {
    const decode = jwtDecode<MyJwtPayload>(token);
    if(!decode.exp) return true;

    return decode.exp * 1000 < Date.now();
}

export const service = (() => {

    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const refreshTokenFetch = async (token: string): Promise<Token> => {

        return await api.post('/auth/refresh-token', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(status)
            .then(response => {
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                if (!accessToken || !newRefreshToken) {
                    throw new Error('Invalid response from server');
                }

                const newTokens: Token = { accessToken, refreshToken: newRefreshToken };
                return newTokens;
            })
            .catch(error => {
                console.error('Error refreshing token:', error);
                throw new Error('Error during token refresh');
            });
    }

    const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        config.headers = config.headers || {};
        const tokens = localStorage.getItem('auth-token');
        // let token = null;
        if(tokens){
            const { accessToken, refreshToken } = JSON.parse(tokens);

            if(accessToken && isTokenExpired(accessToken)){
                if(refreshToken && !isTokenExpired(refreshToken)){
                    try{
                        const newTokens = await refreshTokenFetch(refreshToken);
                        localStorage.setItem('auth-token', JSON.stringify(newTokens));
                        config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    }catch(error){
                        console.error('Error refreshing token:', error);
                        window.location.href = '/login';
                    }
                } else {
                    window.location.href = '/login';
                }
            }

            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }

    const onRequestError = (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }

    const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
        return status(response);
    }

    const onResponseError = (error: Error): Promise<unknown> => {
        return Promise.reject(error);
    }

    api.interceptors.request.use(onRequest, onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;
})();