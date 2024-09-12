import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";


import { useAuth, useAsync } from "@/hooks";
import { FetchResponse, FormState } from "@/domain";
import { validatorForm } from "@/helpers";
import { ReusableInput } from "@/ui";
import { useAuthForm } from "@/useCases";

interface LoginCredentials {
    email: string;
    phone: string;
    password: string;
}

export const Login = () => {

    const { userDetails } = useAuth();
    const navigate = useNavigate();
    const { showBoundary } = useErrorBoundary();

    const { isCellularNumber } = validatorForm;

    const initialCredentials: LoginCredentials = {
        email: '',
        phone: '',
        password: ''
    };

    const initialStateForm: FormState = {
        email: {
            value: initialCredentials.email,
            validation: [
                validatorForm.isEmailOrPhone
            ],
            validateRealTime: false
        },
        password: {
            value: initialCredentials.password,
            validation: [
                validatorForm.validateMinLength
            ],
            validateRealTime: false
        }
    };

    const [ response, setResponse ] = useState<FetchResponse<void>>({
        data: null,
        error: null
    });

    const { 
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
    } = useAuthForm<LoginCredentials>(initialCredentials, initialStateForm);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userValid = validateForm();
        if(userValid && errorResponse === ''){
            const email = userValid.email;
            setCredentials({
                // email: isCellularNumber.isValid(email) ? removeNonNumeric(userValid.username) : userValid.username,
                email: isCellularNumber.isValid(email) ? '' : email,
                phone: isCellularNumber.isValid(email) ? removeNonNumeric(email) : '',
                password: userValid.password
            });
        }
    }

    useAsync(fetchCredentials, setResponse, () => {}, [credentials]);

    useAsync(fetchUserDetails, handleUserDetails, () => {}, [credentials, userDetails]);

    useEffect(() => {
        if(!loading && userDetails){
            navigate('/home', { replace: true });
        }
    }, [loading, userDetails]);

    const handleFirstConnection = () => {
        navigate('/signup', { replace: true });
    }

    const handleOnFocus = (name: string) => {
        setErrorResponse('');
        onFocus(name);
    }

    const isButtonDisabled = (state.email.trim() === '' || state.password.trim() === '');

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
                                                        name: 'email',
                                                        type: 'text',
                                                        value: values.email.value,
                                                        placeholder: 'Enter your email or phone number',
                                                    }}
                                                onChange={handleChange}
                                                onFocus={handleOnFocus}
                                                errorsMessage={values.email.error}/>
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