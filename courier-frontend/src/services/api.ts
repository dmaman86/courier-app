import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

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
})();