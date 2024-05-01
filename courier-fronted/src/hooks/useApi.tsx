import axios from "axios";
import { status } from '../services/status.service';
import { refreshToken } from "../services/refreshTokenFetch";

export const useApi = () => {

    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });


    api.interceptors.request.use((config) => {
        config.headers = config.headers || {};

        // Get tokens from localStorage
        const storedTokens = localStorage.getItem('auth-token');
        const tokens = storedTokens ? JSON.parse(storedTokens) : null;

        if (tokens && tokens.accessToken) {
            config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        }

        return config;
    },(error) => {
        return Promise.reject(error);
    });

    api.interceptors.response.use(
        async response => await status(response),
        async error => {
            const originalRequest = error.config;
            if(error.response && error.response.status === 401 && !originalRequest._retry){
                originalRequest._retry = true;
                try{
                    const newTokens = await refreshToken();
                    localStorage.setItem('auth-token', JSON.stringify(newTokens));
                    originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    return api(originalRequest);
                }catch(error){
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    return api;
}