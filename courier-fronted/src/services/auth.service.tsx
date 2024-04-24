import { service } from "./api";
import { status } from "./status.service";

export const UserService = (() => {

    const getItem = async (url: string) => {
        return await service.get(url)
            .then(status)
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(error));
    }

    return{
        getItem
    }

})();

export const AuthService = (() => {

    const login = async (data: unknown) => {
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

    const logout = async () => {
        return await service.post('/auth/logout')
            .then(status)
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(error));
    }

    return {
        login,
        refreshToken,
        logout
    }
})();