import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { AxiosError } from "axios";

import { paths, validatorForm } from "@/helpers";
import { useAsync, useAuth, useFetchAndLoad, useForm } from "@/hooks";
import { Client, FetchResponse, FormState, SignUpCredentials, Token, User } from "@/types";
import { ReusableInput } from "@/components/shared";
import { PasswordRulesList } from "@/components/partials";
import { serviceRequest } from "@/services";

const initialState: FormState = {
    username: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty,
            validatorForm.isEmailOrPhone
        ],
        validateRealTime: false
    },
    newPassword: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty,
            validatorForm.validateMinLength
        ],
        validateRealTime: true
    },
    confirmPassword: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty,
            validatorForm.validateMinLength,
            {
                isValid: (value: string, formData?: FormState): boolean => value === formData?.newPassword.value,
                message: 'Passwords must be equal'
            }
        ],
        validateRealTime: true
    }
}

export const SignUp = () => {

    const { userDetails, saveUser } = useAuth();
    const navigate = useNavigate();
    const { showBoundary } = useErrorBoundary();

    const { isCellularNumber } = validatorForm;

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { loading, callEndPoint } = useFetchAndLoad();

    const [ errorResponse, setErrorResponse ] = useState('');

    const [ credentials, setCredentials ] = useState<SignUpCredentials | null>(null);

    const [ response, setResponse ] = useState<FetchResponse<void>>({
        data: null,
        error: null
    });

    const [ isValidateForm, setIsValidateForm ] = useState<boolean>(false);

    useEffect(() => {
        if(!loading){
            if(response.error){
                if(response.error instanceof AxiosError && response.error.response){
                    setErrorResponse(response.error.response.data);
                } else{
                    setErrorResponse('An error occurred. Please try again later');
                }
            }
        }
    }, [loading, response]);

    const fetchUserDetails = async () => {
        if(isValidateForm && credentials && !userDetails){
            return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}me`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleUserDetails = (result: FetchResponse<User | Client>) => {
        if(isValidateForm && credentials && !userDetails){
            const { data, error } = result;
            if(data && !error){
                saveUser(data);
                navigate('/home', { replace: true });
            } else if(!data && error){
                showBoundary(error);
            }
        }
    }

    useAsync(fetchUserDetails, handleUserDetails, () => {}, [isValidateForm, credentials, userDetails]);

    useEffect(() => {
        if(isValidateForm && values){
            setCredentials({
                email: isCellularNumber.isValid(values?.username.value) ? null : values?.username.value,
                phone: isCellularNumber.isValid(values?.username.value) ? removeNonNumeric(values?.username.value) : null,
                passwordOne: values.newPassword.value,
                passwordTwo: values.confirmPassword.value
            });
        }
    }, [values]);

    const fetchCredentials = async() => {
        if(credentials){
            return await callEndPoint(serviceRequest.postItem<void, SignUpCredentials>(paths.auth.signUp, credentials));
        }
        return Promise.resolve({ data: null, error: null });
    }

    useAsync(fetchCredentials, setResponse, () => {}, [credentials]);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsValidateForm(validateForm());
    }

    const handleOnFocus = (name: string) => {
        setErrorResponse('');
        onFocus(name);
    }

    const isButtonDisabled = (values?.username.value.trim() === '' || values?.newPassword.value.trim() === '' || values?.confirmPassword.value.trim() === '');


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
                                                        value: values.username.value
                                                    }}
                                                    onChange={ handleChange }
                                                    onFocus={ handleOnFocus }
                                                    errorsMessage={ values.username.error }
                                                    />
                                            </div>
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Password',
                                                        name: 'newPassword',
                                                        type: 'password',
                                                        value: values.newPassword.value,
                                                        placeholder: 'Enter your password'
                                                    }}
                                                    onChange={handleChange}
                                                    onFocus={onFocus}/>
                                                    <PasswordRulesList rules={values.newPassword.validation} errors={values.newPassword.error}/>
                                            </div>
                                            <div className="col-12">
                                                <ReusableInput 
                                                    inputProps={{
                                                        label: 'Confirm password',
                                                        name: 'confirmPassword',
                                                        type: 'password',
                                                        value: values.confirmPassword.value,
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