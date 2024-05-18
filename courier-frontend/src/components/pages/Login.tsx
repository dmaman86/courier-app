import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, useAuth, useFetchAndLoad } from "../../hooks";
import { ReusableInput } from "../shared";
import { FetchResponse, FormState, Token } from "../../types";
import { paths, validatorForm } from "../../helpers";
import { LoginCredentials } from "../../types";
import { AxiosError } from "axios";
import { serviceRequest } from "../../services";

const initialState: FormState = {
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
            validatorForm.validateNotEmpty
        ],
        validateRealTime: false
    }
};

export const Login = () => {

    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    const { isCellularNumber } = validatorForm;

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { username, password } = values;

    const { value: usernameValue, error: usernameError } = username;
    const { value: passwordValue, error: passwordError } = password;

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
        if(!loading && data){
            saveTokens(data);
            navigate('/home', { replace: true });
        }
    }, [data, loading, navigate, saveTokens]);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if(validateForm() && errorResponse === ''){
            const credentials: LoginCredentials = {
                email: !isCellularNumber.validate(usernameValue) ? usernameValue : null,
                phone: isCellularNumber.validate(usernameValue) ? removeNonNumeric(usernameValue) : null,
                password: passwordValue
            }
            const result = await callEndPoint(serviceRequest.postItem<Token, LoginCredentials>(paths.auth.login, credentials));
            setResponse(result);
        }
    }

    const handleOnFocus = (name: string) => {
        setErrorResponse('');
        onFocus(name);
    }

    const isButtonDisabled = (usernameValue.trim() === '' || passwordValue.trim() === '');

    return(
        <>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="bg-white shadow rounded">
                            <div className="row justify-content-center">
                                <div className="col-md-7 pe-0">
                                    <div className="form-left h-100 py-5 px-5">
                                        <form onSubmit={ onSubmit } className="row g-4">
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Email or Phone Number',
                                                        name: 'username',
                                                        type: 'text',
                                                        value: usernameValue,
                                                        placeholder: 'Enter your email or phone number',
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={handleOnFocus}
                                                    errorMessage={usernameError}/>
                                            </div>

                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Password',
                                                        name: 'password',
                                                        type: 'password',
                                                        value: passwordValue,
                                                        placeholder: 'Enter your password'
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={handleOnFocus}
                                                    errorMessage={passwordError}/>
                                            </div>
                                            {errorResponse !== '' && (
                                                    <div className="text-danger errormessage">{errorResponse}</div>
                                                )}

                                            <div className="col pt-3 text-center">
                                                <button type="submit" className="btn btn-primary" disabled={isButtonDisabled}>Login</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}