import { useState, useEffect } from "react";

import { service, status } from '../services';

export const useFetch = (initUrl: string, initOptions = {}) => {

    const [url, setUrl] = useState(initUrl);
    const [options, setOptions] = useState(initOptions);
    const [state, setState] = useState({
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

export const useAxiosGet = (initUrl: string) => {

    const [url, setUrl] = useState(initUrl);
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });


    useEffect(() => {
        const fetchData = async () => {
            await service.get(url)
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
        fetchData();
    }, [url]);

    const updateUrl = (url: string) => setUrl(url);

    return {
        ...state,
        updateUrl
    }
}

