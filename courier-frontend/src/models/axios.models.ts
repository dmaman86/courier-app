import { AxiosResponse, AxiosError } from "axios";

export interface ApiRequest {
  call: Promise<AxiosResponse>;
  controller?: AbortController;
}

export interface ApiError {
  message: string;
  status: number;
  error: string;
  [key: string]: any;
}

export interface FetchResponse<T = any> {
  data: T | null;
  error: ApiError | null;
}
