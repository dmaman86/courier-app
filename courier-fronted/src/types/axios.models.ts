import { AxiosError, AxiosResponse } from "axios";


export interface CustomError {
    error: Error | AxiosError | null;
    cancelled: boolean;
    needLogout: boolean;
}

export interface FetchState<T>{
    data: T | null;
    loading: boolean;
    error: CustomError | null;
}

export interface FetchResponse<T> {
    data: T | null;
    error: CustomError | null;
}

export interface FetchOptions {
    method?: string;
    data?: unknown
}

export interface FetchConfig {
    url?: string;
    options?: FetchOptions
}

export interface AxiosCall<T> {
    call: Promise<AxiosResponse<T>>;
    controller: AbortController;
}
