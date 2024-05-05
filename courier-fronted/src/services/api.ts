import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { Token } from "../types";

const status = (response: AxiosResponse): Promise<AxiosResponse> => {
    if(response.status >= 200 && response.status < 300){
        return Promise.resolve(response);
    }

    return Promise.reject(response);
}

const isTokenExpired = (token: string): boolean => {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode the payload of the token
      return Date.now() >= exp * 1000; // compare the current time with the expiration time
    } catch {
      return true; // assume the token is expired if there is an error
    }
}

export const service = (() => {

    let isTokenRefreshing = false;

    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const validateToken = async (): Promise<Token> => {
        const storedTokens = localStorage.getItem('auth-token');

        if(!storedTokens) throw new Error("No tokens found");

        const { refreshToken } = JSON.parse(storedTokens);
        if(isTokenExpired(refreshToken)) throw new Error("No access token found");

        return refreshTokenFetch(refreshToken);
    }

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
        const tokens = localStorage.getItem('auth-token');
        let token = null;
        if(tokens){
            const tokenObj = JSON.parse(tokens);
            token = tokenObj?.accessToken;
        }
        config.headers.Authorization = token ? `Bearer ${token}` : null;
        return config;
    }

    const onRequestError = (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }

    const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
        return status(response);
    }

    const onResponseError = async(error: Error): Promise<unknown> => {

        if(axios.isCancel(error)){
            return Promise.reject({
                error: error,
                cancelled: true,
                needLogout: false
            })
        }

        if(axios.isAxiosError(error)){
            const err = error as AxiosError;
            if(err.response?.status === 401 && !isTokenRefreshing && err.config){
                isTokenRefreshing = true;
                const originalRequest = err.config;

                try{
                    const newTokens = await validateToken();
                    localStorage.setItem('auth-token', JSON.stringify(newTokens));
                    api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
                    isTokenRefreshing = false;
                    return api(originalRequest);
                }catch(refreshError){
                    isTokenRefreshing = false;
                    return Promise.reject({
                        error: refreshError,
                        cancelled: false,
                        needLogout: true
                    });
                }
            }
        }

        return Promise.reject({
            error: error,
            cancelled: false,
            needLogout: false
        });
        
    }

    api.interceptors.request.use(onRequest, onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;
})();