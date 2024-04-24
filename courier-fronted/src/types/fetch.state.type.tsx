export interface FetchState<T>{
    data: T | null;
    loading: boolean;
    error: Error | null;
}