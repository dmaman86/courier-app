import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, useAuth, useFetch } from "../../hooks";
import { ReusableInput } from "../shared";
import { FormState, Token } from "../../types";
import { paths, validatorForm } from "../../helpers";
import { LoginCredentials } from "../../types/types";
import { AxiosError } from "axios";

const initialState: FormState = {
    username: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty
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

export const Login: React.FC = () => {

    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { username, password } = values;

    const { value: usernameValue, error: usernameError } = username;
    const { value: passwordValue, error: passwordError } = password;

    const { data, loading, error, updateUrl, updateOptions } = useFetch();

    const [ errorResponse, setErrorResponse ] = useState('');

    useEffect(() => {
        if(!loading && error){
            const { error: err } = error;
            if(err instanceof AxiosError && err.response)
                setErrorResponse(err.response.data);
        }
    }, [error, loading]);

    useEffect(() => {
        if(!loading && !error){
            saveTokens(data as Token);
            navigate('/home', { replace: true });
        }
    }, [data, error, loading, navigate, saveTokens]);

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if(validateForm() && errorResponse === ''){
            updateUrl(paths.auth.login);
            const credentials: LoginCredentials = {
                email: usernameValue,
                password: passwordValue
            }
            updateOptions({
                method: 'POST',
                data: JSON.stringify(credentials)
            })
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
                                                        label: 'username',
                                                        name: 'username',
                                                        type: 'text',
                                                        value: usernameValue,
                                                        placeholder: 'Enter your username',
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={handleOnFocus}
                                                    errorMessage={usernameError}/>
                                            </div>

                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'password',
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