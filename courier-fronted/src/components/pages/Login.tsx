import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, useAuth } from "../../hooks";
import { AuthService } from "../../services";
import { ReusableInput } from "../shared/ReusableInput";
import { InputOptions, FormState } from "../../types";

export const Login: React.FC = () => {

    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    const [ formValues, handleInputChange ] = useForm<FormState>({
        username: '',
        password: ''
    });

    const [ usernameError, setUsernameError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');

    const { username, password } = formValues;

    const usernameOptions: InputOptions = {
        label: 'Username',
        type: 'text',
        value: username,
        onChange: handleInputChange,
        error: usernameError,
        resetError: (errorMessage = '') => setUsernameError(errorMessage),
    };

    const passwordOptions: InputOptions = {
        label: 'Password',
        type: 'password',
        value: password,
        onChange: handleInputChange,
        error: passwordError,
        resetError: (errorMessage = '') => setPasswordError(errorMessage),
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        sanitazeValues();

        if(username.length && password.length){
            AuthService.login({
                username,
                password
            }).then((response) => {
                saveTokens(response);
                navigate('/home', { replace: true });
            }).catch((error) => {
                console.log(error);
            });
        }
    }


    const sanitazeValues = () => {
        formValues.username = formValues.username.trim();
        formValues.password = formValues.password.trim();
    }

    return(
        <>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="bg-white shadow rounded">
                            <div className="row justify-content-center">
                                <div className="col-md-7 pe-0">
                                    <div className="form-left h-100 py-5 px-5">
                                        <form onSubmit={ handleSubmit } className="row g-4">
                                            <div className="col-12">
                                                <ReusableInput {...usernameOptions}/>
                                            </div>

                                            <div className="col-12">
                                                <ReusableInput {...passwordOptions}/>
                                            </div>

                                            <div className="col pt-3 text-center">
                                                <button type="submit" className="btn btn-primary">Login</button>
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