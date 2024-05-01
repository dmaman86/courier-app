import axios from "axios";
import { status } from './status.service';
import { refreshTokenFetch } from "./refreshTokenFetch";


const isTokenExpired = (token: string) => {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode the payload of the token
      return Date.now() >= exp * 1000; // compare the current time with the expiration time
    } catch {
      return true; // assume the token is expired if there is an error
    }
};

export const service = (() => {
    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    api.interceptors.request.use((config) => {
        config.headers = config.headers || {};
        const tokens = localStorage.getItem('auth-token');
        let token = null;
        if(tokens){
            const tokenObj = JSON.parse(tokens);
            token = tokenObj?.accessToken;
        }
        config.headers.Authorization = token ? `Bearer ${token}` : null;
        return config;
    });


    api.interceptors.response.use(
        async response => await status(response),
        async error => {
            const originalRequest = error.config;
            if(error.response && error.response.status === 401 && !originalRequest._retry){
                originalRequest._retry = true;

                const storedTokens = localStorage.getItem('auth-token');
                if(!storedTokens) return Promise.reject(error);

                const { refreshToken } = JSON.parse(storedTokens);
                if(isTokenExpired(refreshToken)) return Promise.reject(new Error("Refresh token has expired"));
                
                try{
                    const newTokens = await refreshTokenFetch(refreshToken);
                    localStorage.setItem('auth-token', JSON.stringify(newTokens));
                    originalRequest.headers.Authorization = `Bearer ${newTokens.refreshToken}`;
                    return api(originalRequest);
                }catch(refreshError){
                    return Promise.reject({ ...error, logoutRequired: true });
                }
            }
            return Promise.reject(error);
        }
    )

    return api;
})();