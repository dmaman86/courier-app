import { useState, useEffect, useCallback } from "react";

import { FetchConfig, FetchOptions, FetchState } from "../types";
import axios from "axios";
import { service } from "../services";
import { Cache } from "../services";

export const useFetch = ({url: initUrl, options: initOptions}: FetchConfig = {}) => {

    const [ url, setUrl ] = useState(initUrl);
    const [ options, setOptions ] = useState(initOptions);
    const [ isActive, setIsActive ] = useState(false);
    const [ state, setState ] = useState<FetchState<unknown>>({
        data: null,
        loading: true,
        error: null
    });

    const fetchData = useCallback( () => {
        if(url === undefined || url === '' || !isActive) return;

        const cacheKey = url + JSON.stringify(options); // create a unique key for the cache
        const cachedData = Cache.getValue(cacheKey);
        if(cachedData){
            setState({
                data: cachedData,
                loading: false,
                error: null
            })
            return;
        }

        const source = axios.CancelToken.source();
        setState({ data: null, loading: true, error: null });

        service({
            url,
            method: options?.method || 'GET',
            data: options?.data,              
            headers: options?.headers,        
            cancelToken: source.token         
        })
                    .then(response =>{
                        Cache.setValue(cacheKey, response.data);
                        setState({
                            data: response.data,
                            loading: false,
                            error: null
                        })
                    
                    }).catch(error => {
                        if(!axios.isCancel(error)){
                            setState({
                                data: null,
                                loading: false,
                                error: error
                            })
                        }
                    }).finally(() => setIsActive(false));
        // return function to cleaned canceled request
        return () => source.cancel();
    }, [url, options, isActive]);

    useEffect(() => {
        if(isActive){
            const cancelFetch = fetchData();
            return cancelFetch;
        }
    }, [fetchData, isActive]);

    const updateUrl = (url: string) => {
        setUrl(url);
        setIsActive(true);
    }

    const updateOptions = (options: FetchOptions) => {
        setOptions(prev => ({...prev, ...options}));
        setIsActive(true);
    }

    return {
        ...state,
        updateUrl,
        updateOptions
    }

}