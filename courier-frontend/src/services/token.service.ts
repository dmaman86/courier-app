import { Token } from "@/domain";

export const TokenService = (() => {

    const getRefreshToken = (): string | null => {
        const tokens = getToken();
        return tokens?.refreshToken || null;
    }

    const getAccessToken = (): string | null => {
        const tokens = getToken();
        return tokens?.accessToken || null;
    }

    const updateToken = (accessToken: string, refreshToken: string) => {
        const tokens = getToken();
        if(tokens){
            tokens.accessToken = accessToken;
            tokens.refreshToken = refreshToken;
            setToken(tokens);
        }
    }

    const removeToken = () => {
        localStorage.removeItem('auth-token');
    }

    const getToken = (): Token => {
        const tokens = localStorage.getItem('auth-token');
        return tokens ? JSON.parse(tokens) : null;
    }

    const setToken = (tokens: Token) => {
        localStorage.setItem('auth-token', JSON.stringify(tokens));
    }

    return {
        getToken,
        setToken,
        getRefreshToken,
        getAccessToken,
        updateToken,
        removeToken
    }

})();