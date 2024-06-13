import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useNavigate, useLocation} from "react-router-dom";


import { useForm, useFetchAndLoad, useAuth, useAsync } from "@/hooks";
import { ReusableInput } from "@/components/shared";
import { FetchResponse, FormState, Token } from "@/types";
import { paths, validatorForm } from "@/helpers";
import { LoginCredentials } from "@/types";
import { AxiosError } from "axios";
import { serviceRequest } from "@/services";

export const Login = () => {

    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');

    const { isCellularNumber } = validatorForm;

    const [ initialState, setInitialState ] = useState<FormState>({
        username: {
            value: '',
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.isEmailOrPhone
            ],
            validateRealTime: false
        },
        password: {
            value: '',
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.validateMinLength
            ],
            validateRealTime: false
        }
    });

    const [ isValidForm, setIsValidForm ] = useState<boolean>(false);

    const [ credentials, setCredentials ] = useState<LoginCredentials | null>(null);

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { loading, callEndPoint } = useFetchAndLoad();

    const [ errorResponse, setErrorResponse ] = useState('');

    const [ response, setResponse ] = useState<FetchResponse<Token>>({
        data: null,
        error: null
    });

    const { data, error } = response;

    useEffect(() => {
        if(!loading && error){
            if(error instanceof AxiosError && error.response)
                setErrorResponse(error.response.data);
        }
    }, [error, loading]);

    useEffect(() => {
        if(message) setErrorResponse(message);
    }, [message]);

    useEffect(() => {
        if(!loading && data){
            saveTokens && saveTokens(data);
            navigate('/home', { replace: true });
        }
    }, [data, loading, navigate, saveTokens]);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        setIsValidForm(validateForm() && errorResponse === '');
    }

    useEffect(() => {
        if(isValidForm && values){
            setCredentials({
                email: !isCellularNumber.isValid(values.username.value) ? values.username.value : null,
                phone: isCellularNumber.isValid(values.username.value) ? removeNonNumeric(values.username.value) : null,
                password: values.password.value
            });
        }
    }, [isValidForm, values]);

    const fetchCredentials = async() => {
        if(credentials){
            return await callEndPoint(serviceRequest.postItem<Token, LoginCredentials>(paths.auth.login, credentials));
        }
        return Promise.resolve({ data: null, error: null });
    }

    useAsync(fetchCredentials, setResponse, () => {}, [credentials]);

    const handleFirstConnection = () => {
        navigate('/signup', { replace: true });
    }

    const handleOnFocus = (name: string) => {
        setErrorResponse('');
        onFocus(name);
    }

    const isButtonDisabled = (values ? (values.username.value.trim() === '' || values.password.value.trim() === '') : false);

    return(
        <>
            {
                values && (
                    <div className="container pt-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card shadow">
                                    <div className="card-body p-5">
                                        <form onSubmit={ onSubmit } className="row g-4">
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Email or Phone Number',
                                                        name: 'username',
                                                        type: 'text',
                                                        value: values.username.value,
                                                        placeholder: 'Enter your email or phone number',
                                                    }}
                                                onChange={handleChange}
                                                onFocus={handleOnFocus}
                                                errorsMessage={values.username.error}/>
                                            </div>

                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Password',
                                                        name: 'password',
                                                        type: 'password',
                                                        value: values.password.value,
                                                        placeholder: 'Enter your password'
                                                    }}
                                                onChange={handleChange}
                                                onFocus={handleOnFocus}
                                                errorsMessage={values.password.error}/>
                                            </div>
                                            {
                                                errorResponse && <div className="text-danger text-center">{errorResponse}</div>
                                            }

                                            <div className="col pt-3 text-center">
                                                <Stack spacing={2} direction='row' justifyContent='center'>
                                                    <button type="submit" className="btn btn-primary" disabled={isButtonDisabled}>Login</button>
                                                    <button type="button" className="btn btn-primary" onClick={handleFirstConnection}>First connection?</button>
                                                </Stack>
                                                        
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );

}