import { useEffect, useState } from "react";
import { AxiosCall, FetchResponse } from "../domain";
import { AxiosError, AxiosResponse } from "axios";


export const useFetchAndLoad = () => {

    const [ loading, setLoading ] = useState(false);
    const [ controller, setController ] = useState<AbortController | null>(null);

    const callEndPoint = async <T>(axiosCall: AxiosCall<T>): Promise<FetchResponse<T>> => {
        let response: FetchResponse<T> = { data: null, error: null };

        const newController = axiosCall.controller || new AbortController();
        setController(newController);
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
        if(controller){
            controller.abort();
            setController(null);
        }
        setLoading(false);
    }

    useEffect(() => {
        return () => {
            cancelEndPoint();
        }
    }, []);

    return { loading, callEndPoint };
}