import { useState, useEffect } from "react";

import { service, status } from '../services';
import { FetchState } from "../types";

export const useFetch = (initUrl: string, initOptions = {}) => {

    const [url, setUrl] = useState(initUrl);
    const [options, setOptions] = useState(initOptions);
    const [state, setState] = useState<FetchState<unknown>>({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchData = async () => {
            await service(url, options)
                        .then(status)
                        .then(response =>
                            setState({
                                data: response.data,
                                loading: false,
                                error: null
                            })
                        ).catch(error => 
                            setState({
                                data: null,
                                loading: false,
                                error: error
                            })
                        )
        };
        if(url !== '')
            fetchData();
    }, [url, options]);

    const updateUrl = (url: string) => setUrl(url);

    const updateOptions = (options: object) => setOptions(options);

    return {
        ...state,
        updateUrl,
        updateOptions
    }

}

