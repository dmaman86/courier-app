import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, Axios, AxiosRequestConfig } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

import { Token } from "@/types";
import { TokenService } from "./token.service";

interface MyJwtPayload extends JwtPayload {
    exp: number;
}

const status = (response: AxiosResponse): Promise<AxiosResponse> => {
    if(response.status >= 200 && response.status < 300){
        return Promise.resolve(response);
    }

    return Promise.reject(response);
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

    const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        config.headers = config.headers || {};
        const accessToken = TokenService.getAccessToken();

        if(accessToken)
            config.headers.Authorization = `Bearer ${accessToken}`;
        
        return config;
    }

    const onRequestError = (error: any): Promise<any> => {
        return Promise.reject(error);
    }

    const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
        return status(response);
    }

    const onResponseError = async(error: any): Promise<any> => {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            const refreshToken = TokenService.getRefreshToken();
            if(refreshToken){
                try{
                    const newTokens = await refreshTokenFetch(refreshToken);
                    TokenService.updateToken(newTokens.accessToken, newTokens.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    return api(originalRequest);
                }catch(refreshError){
                    console.error('Error refreshing token:', error);
                    TokenService.removeToken();
                    return Promise.reject(refreshError);
                    // window.location.href = '/login?message=Error refreshing token. Please login again.';
                }
            }
        }
        return Promise.reject(error);
    }

    api.interceptors.request.use(onRequest, onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;
})();

/*const isTokenExpired = (token: string): boolean => {
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
        const accessToken = TokenService.getAccessToken();

        if(accessToken){
            if(!isTokenExpired(accessToken)){
                config.headers.Authorization = `Bearer ${accessToken}`;
            }else{
                const refreshToken = TokenService.getRefreshToken();
                if(refreshToken && !isTokenExpired(refreshToken)){
                    try{
                        const newTokens = await refreshTokenFetch(refreshToken);
                        TokenService.updateToken(newTokens.accessToken, newTokens.refreshToken);
                        config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    }catch(error){
                        console.error('Error refreshing token:', error);
                        TokenService.removeToken();
                        window.location.href = '/login?message=Error refreshing token. Please login again.';
                    }
                }else{
                    TokenService.removeToken();
                    window.location.href = '/login?message=Session expired. Please login again.';
                }
            }
            
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
})();*/