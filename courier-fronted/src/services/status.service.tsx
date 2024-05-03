import { AxiosError, AxiosResponse } from "axios";


export const status = (response: AxiosResponse): Promise<AxiosResponse> => {
    if(response.status >= 200 && response.status < 300){
        return Promise.resolve(response);
    }
    const error: AxiosError = {
        isAxiosError: true,
        config: response.config,
        response: response,
        toJSON: () => ({ message: response.statusText, name: "AxiosError" }),
        name: "AxiosError",
        message: `Request failed with status code ${response.status}`
    };
    return Promise.reject(error);
}