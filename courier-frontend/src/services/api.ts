import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { Token } from "@/types";
import { TokenService } from "./token.service";

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
    let isRefreshing = false;
    const failedQueue: { resolve: (token: string) => void, reject: (error: any) => void }[] = [];

    const processQueue = (error: any, token: string | null = null) => {
        failedQueue.forEach(prom => {
            if(error){
                prom.reject(error);
            }else{
                prom.resolve(token as string);
            }
        });

        failedQueue.length = 0;
    }

    const refreshTokenFetch = async (token: string): Promise<Token> => {

        return await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/auth/refresh',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: {}
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
        if(error.response && error.response.status === 401){
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }
            isRefreshing = true;
            const refreshToken = TokenService.getRefreshToken();
            if(refreshToken){
                return new Promise(async (resolve, reject) => {
                    try{
                        const newTokens = await refreshTokenFetch(refreshToken);
                        console.log('New tokens:', newTokens);
                        TokenService.updateToken(newTokens.accessToken, newTokens.refreshToken);
                        api.defaults.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                        processQueue(null, newTokens.accessToken);
                        isRefreshing = false;
                        resolve(api(originalRequest));
                    }catch(refreshError){
                        console.error('Error refreshing token:', error);
                        TokenService.removeToken();
                        processQueue(refreshError, null);
                        isRefreshing = false;
                        reject(refreshError);
                    }
                });
            }
        }
        return Promise.reject(error);
    }

    api.interceptors.request.use(onRequest, onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;
})();