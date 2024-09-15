import { useEffect, useState } from "react";

import { FetchResponse, FormState, User, AxiosCall } from "@/domain";
import { useAuth, useFetchAndLoad, useForm } from "@/hooks";
import { AxiosError } from "axios";
import { paths } from "@/helpers";
import { serviceRequest } from "@/services";

export const useAuthForm = <T extends Record<string, any>>
    (initialCredentials: T, 
    initialForm: FormState) => {

    const { saveUser } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();
    
    const [ errorResponse, setErrorResponse ] = useState<string>('');
    const [ credentials, setCredentials ] = useState<T | null>(null);

    const { values, state, handleChange, onFocus, validateForm } = useForm(initialCredentials, initialForm);

    const fetchData = async<R>(service: () => AxiosCall<R>): Promise<FetchResponse<R>> => {
        const axiosCall = service();
        return await callEndPoint(axiosCall);
    }

    const handleError = (error: any) => {
        if (error.isAxiosError) {
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.message;
            const errorData = axiosError.response?.data || '';
            const statusText = axiosError.response?.statusText || '';
            const fullErrorMessage = `${errorMessage}: ${errorData}. ${statusText}`;
            setErrorResponse(fullErrorMessage);
        } else if (error instanceof Error) {
            setErrorResponse(error.message || 'An unexpected error occurred.');
        } else {
            setErrorResponse('An unknown error occurred.');
        }
    }

    const authenticate = async (credentials: T, isSignUp: boolean) => {
        try {
            const url = isSignUp ? paths.auth.signUp : paths.auth.login;
            const responseCredentials = await fetchData(() => serviceRequest.postItem(url, credentials));

            if (responseCredentials.error) {
                throw responseCredentials.error;
            }

            const { data, error }: FetchResponse<User> = await fetchData(() => serviceRequest.getItem<User>(`${paths.courier.users}me`));
            saveUser((data && !error) ? data : null);
        } catch (error: any) {
            handleError(error);
        }
    }
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const message = queryParams.get('message');
        if (message) setErrorResponse(message);
    }, [location.search]);

    return {
        values,
        state,
        handleChange,
        onFocus,
        validateForm,
        credentials,
        setCredentials,
        errorResponse,
        authenticate,
        setErrorResponse
    }
}