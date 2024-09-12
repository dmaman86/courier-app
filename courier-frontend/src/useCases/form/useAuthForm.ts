import { useEffect, useState } from "react";

import { Client, FetchResponse, FormState, User } from "@/domain";
import { useAuth, useFetchAndLoad, useForm } from "@/hooks";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";

export const useAuthForm = <T extends Record<string, any>>(initialCredentials: T, initialForm: FormState, isSignUp: boolean = false) => {

    const { userDetails, saveUser } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();
    
    const [ errorResponse, setErrorResponse ] = useState<string>('');
    const [ credentials, setCredentials ] = useState<T | null>(null);

    const { values, state, handleChange, onFocus, validateForm } = useForm(initialCredentials, initialForm);

    const fetchUserDetails = async () => {
        if(credentials && !userDetails){
            return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}me`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleUserDetails = (result: FetchResponse<User | Client>) => {
        const { data, error } = result;

        saveUser((data && !error) ? data : null);
    }

    const fetchCredentials = async () => {
        if (credentials) {
          const url = isSignUp ? paths.auth.signUp : paths.auth.login;
          return await callEndPoint(serviceRequest.postItem<void, T>(url, credentials));
        }
        return Promise.resolve({ data: null, error: null });
    };

    useEffect(() => {
        if (!loading && errorResponse) {
          setErrorResponse('An error occurred. Please try again later');
        }
    }, [loading]);
    
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
        fetchCredentials,
        fetchUserDetails,
        handleUserDetails,
        credentials,
        setCredentials,
        errorResponse,
        setErrorResponse,
        loading
    }
}

/*export const useAuthForm = (initialForm: FormState, isSignUp: boolean = false) => {

    const { userDetails, saveUser } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();
    
    const [errorResponse, setErrorResponse] = useState<string>('');
    const [isValidForm, setIsValidForm] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<any>(null);

    const { values, handleChange, onFocus, validateForm } = useForm(initialForm);

    const fetchUserDetails = async () => {
        if(isValidForm && credentials && !userDetails){
            return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}me`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleUserDetails = (result: FetchResponse<User | Client>) => {
        const { data, error } = result;

        if(isValidForm && credentials && !userDetails){    
            saveUser((data && !error) ? data : null);
        }
    }

    const fetchCredentials = async () => {
        if (credentials) {
          const url = isSignUp ? paths.auth.signUp : paths.auth.login;
          return await callEndPoint(serviceRequest.postItem<void, typeof credentials>(url, credentials));
        }
        return Promise.resolve({ data: null, error: null });
    };
    
    useEffect(() => {
        if (!loading && errorResponse) {
          setErrorResponse('An error occurred. Please try again later');
        }
    }, [loading]);
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const message = queryParams.get('message');
        if (message) setErrorResponse(message);
    }, [location.search]);


    return {
        values,
        handleChange,
        onFocus,
        validateForm,
        isValidForm,
        setIsValidForm,
        fetchCredentials,
        fetchUserDetails,
        handleUserDetails,
        credentials,
        setCredentials,
        errorResponse,
        setErrorResponse,
        loading
    }

}*/