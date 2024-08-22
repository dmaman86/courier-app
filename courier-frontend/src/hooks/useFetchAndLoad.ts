import { useEffect, useState } from "react";
import { AxiosCall, FetchResponse } from "../types";
import { AxiosError, AxiosResponse } from "axios";


export const useFetchAndLoad = () => {

    const [ loading, setLoading ] = useState(false);
    let controller: AbortController;

    const callEndPoint = async <T>(axiosCall: AxiosCall<T>): Promise<FetchResponse<T>> => {
        let response: FetchResponse<T> = { data: null, error: null };

        if(axiosCall.controller) controller = axiosCall.controller;
        setLoading(true);

        try{
            const result: AxiosResponse<T> = await axiosCall.call;
            
            if(result && result.data !== undefined) response.data = result.data;
        }catch(err){
            response.error = err as Error | AxiosError;
        } finally {
            setLoading(false);
        }
        return response;
    }

    const cancelEndPoint = () => {
        setLoading(false);
        controller && controller.abort();
    }

    useEffect(() => {
        return () => {
            cancelEndPoint();
        }
    }, []);

    return { loading, callEndPoint };
}