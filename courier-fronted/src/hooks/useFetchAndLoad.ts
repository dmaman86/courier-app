import { useEffect, useState } from "react";
import { AxiosCall, CustomError, FetchResponse } from "../types";
import { AxiosResponse } from "axios";


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
            const error = err as CustomError;
            setLoading(false);
            if(!error.cancelled){
                return { data: null, error };
            }
        }
        setLoading(false);
        return { data: null, error: null };
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