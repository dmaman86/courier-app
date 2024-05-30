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

export interface PageResponse<T> {
    content: T;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: { pageNumber: number, pageSize: number, paged: boolean, sort: { empty: boolean, unsorted: boolean, sorted: boolean }, unpaged: boolean };
    size: number;
    sort: { empty: boolean, unsorted: boolean, sorted: boolean };
    totalElements: number;
    totalPages: number;
}

export interface FetchResponse<T> {
    data: T | null;
    error: Error | AxiosError | null;
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
    controller?: AbortController;
}
