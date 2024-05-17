import { useEffect, useState } from "react";
import { AxiosCall, FetchResponse } from "../types";
import { AxiosError, AxiosResponse } from "axios";


export const useFetchAndLoad = () => {

    const [ loading, setLoading ] = useState(false);
    let controller: AbortController;

    const callEndPoint = async <T>(axiosCall: AxiosCall<T>): Promise<FetchResponse<T>> => {
        if(axiosCall.controller) controller = axiosCall.controller;
        setLoading(true);

        try{
            const result: AxiosResponse<T> = await axiosCall.call;
            setLoading(false);
            return { data: result.data, error: null };           
        }catch(err){
            setLoading(false);
            return { data: null, error: err as Error | AxiosError };
        }
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