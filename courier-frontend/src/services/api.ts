// import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { paths } from "@/helpers";

interface ApiError {
    message: string;
    code: string;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const status = (response: AxiosResponse): Promise<AxiosResponse> => {
    if(response.status >= 200 && response.status < 300){
        return Promise.resolve(response);
    }

    return Promise.reject(response);
}

export const service = (() => {

    const api: AxiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
    
    const refreshAccessToken = async(): Promise<void> => {
        await api.post('/auth/refresh', {}, { withCredentials: true });
    }

    const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {  
        return config;
    }

    const onRequestError = (error: any): Promise<any> => {
        return Promise.reject(error);
    }

    const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
        return status(response);
    }

    const onResponseError = async(error: AxiosError): Promise<any> => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if(!originalRequest) return Promise.reject(error);

        if(error.response?.status === 401){
            if(originalRequest.url === paths.auth.login){
                const apiError = error.response.data as ApiError;
                console.error('Error during login:', apiError);
                return Promise.reject(error);
            }

            if(!originalRequest._retry){
                originalRequest._retry = true;

                try{
                    await refreshAccessToken();

                    return api(originalRequest);
                }catch(refreshError){
                    console.error('Error during token refresh:', refreshError);
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);

        /*if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                await api.post('/auth/refresh', {}, { withCredentials: true });

                return api(originalRequest);
            }catch(refreshError){
                console.error('Error during token refresh:', refreshError);
                return Promise.reject(refreshError);
            }
        }*/
    }

    api.interceptors.request.use(onRequest, onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;

})();

/*export const service = (() => {

    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });

    const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {  
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

        if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                await api.post('/auth/refresh', {}, { withCredentials: true });

                return api(originalRequest);
            }catch(refreshError){
                console.error('Error during token refresh:', refreshError);
                return Promise.reject(refreshError);
            }
        }
    }

    api.interceptors.request.use(onRequest, onRequestError);
    api.interceptors.response.use(onResponse, onResponseError);

    return api;
})();*/