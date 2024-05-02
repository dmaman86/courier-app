import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { FetchState } from "../types";
import { service } from "../services";



export const useFetchQuery = ({ baseUrl, defaultQuery = '', debounceDelay = 300}: { baseUrl: string, defaultQuery: string, debounceDelay: number}) => {

    const [ searchItem, setSearchItem ] = useState<string>(defaultQuery);
    const [ isActive, setIsActive ] = useState(false);
    const [ state, setState ] = useState<FetchState<unknown>>({
        data: null,
        loading: true,
        error: null
    });

    const fetchData = useCallback(debounce(async (currentQuery: string) => {
        if (currentQuery === '' || !isActive){
            setState({ data: null, loading: false, error: null });
            return;
        }

        setState({ data: null, loading: true, error: null });
        const url = `${baseUrl}/${encodeURIComponent(currentQuery)}`;
        await service.get(url)
            .then(response => setState({ data: response.data, loading: false, error: null }))
            .catch(error => setState({ data: null, loading: false, error: error }))
            .finally(() => setIsActive(false));
    }, debounceDelay), [baseUrl, isActive, debounceDelay]);


    useEffect( () => {
        fetchData(searchItem);

        return () => fetchData.cancel();
    }, [fetchData, searchItem]);

    const updateSearchItem = (value: string) => {
        setSearchItem(value);
        setIsActive(true);
    }

    return {
        ...state,
        updateSearchItem
    }


}