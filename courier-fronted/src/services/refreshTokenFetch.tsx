import axios from "axios";
import { Token } from "../types";


export const refreshTokenFetch = async (token: string): Promise<Token> => {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/refresh-token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to refresh token');
        }

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        if (!accessToken || !newRefreshToken) {
            throw new Error('Invalid response from server');
        }

        const newTokens: Token = { accessToken, refreshToken: newRefreshToken };
        return newTokens;
    } catch (error) {
        // Podrías manejar errores específicos o re-lanzarlos
        console.error('Error refreshing token:', error);
        throw new Error('Error during token refresh');
    }
};