import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, useAuth, useFetch } from "../../hooks";
import { ReusableInput } from "../shared";
import { FormState, Token } from "../../types";
import { paths } from "../../constants/paths";
import { LoginCredentials } from "../../types/types";

const initialState: FormState = {
    username: {
        value: '',
        validation: [
            {
                validate: (value: string) => value.length > 0,
                errorMessage: 'Username is required'
            }
        ]
    },
    password: {
        value: '',
        validation: [
            {
                validate: (value: string) => value.length > 0,
                errorMessage: 'Password is required'
            }
        ]
    }
};

export const Login: React.FC = () => {

    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { data, loading, error, updateUrl, updateOptions } = useFetch();

    useEffect(() => {
        if(!loading && !error){
            saveTokens(data as Token);
            navigate('/home', { replace: true });
        }
    }, [data, error, loading]);

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm()){
            updateUrl(paths.auth.login);
            const credentials: LoginCredentials = {
                email: values.username.value,
                password: values.password.value
            }
            updateOptions({
                method: 'POST',
                data: JSON.stringify(credentials)
            })
        }
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
                                        <form onSubmit={ onSubmit } className="row g-4">
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'username',
                                                        name: 'username',
                                                        type: 'text',
                                                        value: values.username.value,
                                                        placeholder: 'Enter your username',
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={onFocus}
                                                    errorMessage={values.username.error}/>
                                            </div>

                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'password',
                                                        name: 'password',
                                                        type: 'password',
                                                        value: values.password.value,
                                                        placeholder: 'Enter your password'
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={onFocus}
                                                    errorMessage={values.password.error}/>
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