import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

import { validatorForm } from "@/helpers";
import { useAsync, useAuth } from "@/hooks";
import { FetchResponse, FormState } from "@/domain";
import { PasswordRulesList, ReusableInput } from "@/ui";
import { useAuthForm } from "@/useCases";


interface SignUpCredentials {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export const SignUp = () => {

    const { userDetails } = useAuth();
    const navigate = useNavigate();
    const { showBoundary } = useErrorBoundary();

    const { isCellularNumber } = validatorForm;

    const initialCredentials: SignUpCredentials = {
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    }

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
            validateRealTime: true
        },
        confirmPassword: {
            value: initialCredentials.confirmPassword,
            validation: [
                validatorForm.validateMinLength,
                validatorForm.isEqual('password')
            ],
            validateRealTime: true
        }
    }
    

    const [ response, setResponse ] = useState<FetchResponse<void>>({
        data: null,
        error: null
    });

    const { values,
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
            loading } = useAuthForm<SignUpCredentials>(initialCredentials, initialStateForm, true);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userValid = validateForm();
        if(userValid && errorResponse === ''){
            const email = userValid.email;
            setCredentials({
                email: isCellularNumber.isValid(email) ? '' : email,
                phone: isCellularNumber.isValid(email) ? removeNonNumeric(email) : '',
                password: userValid.password,
                confirmPassword: userValid.confirmPassword
            });
        }
    }

    useAsync(fetchCredentials, setResponse, () => {}, [credentials]);

    useAsync(fetchUserDetails, handleUserDetails, () => {}, [credentials, userDetails]);

    useEffect(() => {
        if(!loading && userDetails){
            navigate('/home', { replace: true });
        }
    }, [userDetails]);

    const handleOnFocus = (name: string) => {
        setErrorResponse('');
        onFocus(name);
    }

    const isButtonDisabled = (state.email.trim() === '' || state.password.trim() === '' || state.confirmPassword.trim() === '');


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
                                                        value: state.email
                                                    }}
                                                    onChange={ handleChange }
                                                    onFocus={ handleOnFocus }
                                                    errorsMessage={ values.email.error }
                                                    />
                                            </div>
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Password',
                                                        name: 'password',
                                                        type: 'password',
                                                        value: state.password,
                                                        placeholder: 'Enter your password'
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={onFocus}/>
                                                    <PasswordRulesList rules={values.password.validation} errors={values.password.error}/>
                                            </div>
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Confirm password',
                                                        name: 'confirmPassword',
                                                        type: 'password',
                                                        value: state.confirmPassword,
                                                        placeholder: 'Enter your password again'
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={onFocus}/>
                                                    <PasswordRulesList rules={values.confirmPassword.validation} errors={values.confirmPassword.error}/>
                                            </div>
                                            <div className={`text-danger errormessage ${errorResponse ? '' : 'd-none'}`}>{errorResponse}</div>
                                            <div className="col-12 text-center pt-3">
                                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                                    <button className="btn btn-primary" type="submit" disabled={isButtonDisabled}>Sign Up</button>
                                                </div>
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
    )
}