import { AxiosResponse } from "axios";
import { service } from "./api";
import { FormState } from "../types";

const status = (response: AxiosResponse) => {
    if(response.status >= 200 && response.status < 300){
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
}

export const AuthService = (() => {

    const login = async (data: FormState) => {
        return await service.post('/auth/signin', data)
                        .then(status)
                        .then((response) => Promise.resolve(response.data))
                        .catch((error) => Promise.reject(error));
    }

    const refreshToken = async (token: string) => {
        return await service.post('/auth/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(status)
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(error));
    }

    return {
        login,
        refreshToken
    }
})();