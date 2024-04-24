import axios from "axios";

export const service = (() => {
    const api = axios.create({
        baseURL: 'http://localhost:8080/api'
    });

    api.interceptors.request.use((config) => {
        config.headers = config.headers || {};
        const tokens = localStorage.getItem('auth-token');
        let token = null;
        if(tokens){
            const tokenObj = JSON.parse(tokens);
            token = tokenObj.accessToken;
            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }else{
                delete config.headers.Authorization;
            }
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    });

    return api;
})();