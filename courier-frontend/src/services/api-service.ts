import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ApiError } from "@/models";

interface ExtendedAiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiService = (() => {
  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  const noRetryEndpoints = ["/auth/signin", "/auth/signup"];

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      await api.post(
        "/credential/refresh-token",
        {},
        { withCredentials: true },
      );
      return true;
    } catch (error) {
      console.error("Error during refresh token: ", error);
      return false;
    }
  };

  const onRequest = (config: InternalAxiosRequestConfig) => {
    return config;
  };

  const onRequestError = (error: AxiosError): Promise<never> =>
    Promise.reject(error);

  const onResponse = (response: AxiosResponse): Promise<AxiosResponse> =>
    Promise.resolve(response);

  const onResponseError = async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config as ExtendedAiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    const apiError = error.response?.data as ApiError;

    if (error.response?.status === 401) {
      if (noRetryEndpoints.includes(originalRequest.url || "")) {
        console.error("Auth error: ", apiError);
        return Promise.reject(apiError);
      }
      if (!originalRequest._retry) {
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) return api(originalRequest);
      }
    }
    return Promise.reject(apiError);
  };

  api.interceptors.request.use(onRequest, onRequestError);
  api.interceptors.response.use(onResponse, onResponseError);

  return api;
})();
