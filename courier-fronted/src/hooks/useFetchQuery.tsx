import { useEffect, useRef, useState } from "react";
import { CustomError, FetchState } from "../types";
import { service } from "../services";

export const useFetchQuery = ({ baseUrl, defaultQuery = '', debounceDelay = 300}: { baseUrl: string, defaultQuery: string, debounceDelay: number}) => {

    const [ searchItem, setSearchItem ] = useState<string>(defaultQuery);
    const [ isActive, setIsActive ] = useState(false);
    const [ state, setState ] = useState<FetchState<unknown>>({
        data: null,
        loading: true,
        error: null
    });
    const fetchRef = useRef<number | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if(searchItem.trim() === '' || !isActive){
                setState({ data: null, loading: false, error: null });
                return;
            }

            if(abortControllerRef.current){
                abortControllerRef.current.abort();
            }
    
            abortControllerRef.current = new AbortController();
            setState({ data: null, loading: true, error: null });

            await service.get(`${baseUrl}/${encodeURIComponent(searchItem)}`,
                                 { signal: abortControllerRef.current?.signal })
                        .then(response => setState({ data: response.data, loading: false, error: null }))
                        .catch(error => {
                            const customError = error as CustomError;
                            if(!customError.cancelled){
                                setState({
                                    data: null,
                                    loading: false,
                                    error: customError
                                })
                            }
                        })
                        .finally(() => setIsActive(false));
        }

        if(fetchRef.current){
            clearTimeout(fetchRef.current);
        }
        fetchRef.current = setTimeout(fetchData, debounceDelay);

        return () => {
            if(fetchRef.current)
                clearTimeout(fetchRef.current);
            if(abortControllerRef.current)
                abortControllerRef.current.abort();
        }

    }, [searchItem, isActive, debounceDelay, baseUrl]);

    const updateSearchItem = (value: string) => {
        if(value.trim() !== ''){
            setSearchItem(value.trim())
            setIsActive(true);
        }
    }

    return {
        ...state,
        updateSearchItem
    }


}