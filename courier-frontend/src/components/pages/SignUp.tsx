import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"

import { paths, validatorForm } from "../../helpers"
import { useAuth, useFetchAndLoad, useForm } from "../../hooks"
import { FetchResponse, FormState, SignUpCredentials, Token } from "../../types"
import { ReusableInput } from "../shared"
import { PasswordRulesList } from "../partials"
import { serviceRequest } from "../../services"


const initialState: FormState = {
    username: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty,
            validatorForm.isEmailOrPhone
        ],
        validateRealTime: false
    },
    passwordOne: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty,
            validatorForm.validateMinLength
        ],
        validateRealTime: true
    },
    passwordTwo: {
        value: '',
        validation: [
            validatorForm.validateNotEmpty,
            validatorForm.validateMinLength
        ],
        validateRealTime: true
    }
}

const validateEquals = (valueOne: string, valueTwo: string) => {
    return {
        isValid: valueOne === valueTwo,
        error: 'Passwords must be equal'
    }
}

export const SignUp = () => {

    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    const { isCellularNumber } = validatorForm;

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { loading, callEndPoint } = useFetchAndLoad();

    const [ errorResponse, setErrorResponse ] = useState('');

    const [ error, setError ] = useState<string>('');

    const [ response, setResponse ] = useState<FetchResponse<Token>>({
        data: null,
        error: null
    });

    useEffect(() => {
        if(!loading && response.error){
            if(response.error instanceof AxiosError && response.error.response)
                setErrorResponse(response.error.response.data);
        }
    }, [loading, response]);

    useEffect(() => {
        if(!loading && response.data){
            saveTokens(response.data);
            navigate('/home', { replace: true });
        }
    }, [loading, response, navigate, saveTokens]);

    useEffect(() => {
        if(values.passwordOne.value !== '' && values.passwordTwo.value !== ''){
            const res = validateEquals(values.passwordOne.value, values.passwordTwo.value);
            !res.isValid ? setError(res.error) : setError('');
        }
    }, [values]);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm() && error === ''){
            const credentials: SignUpCredentials = {
                email: isCellularNumber.validate(values.username.value) ? null : values.username.value,
                phone: isCellularNumber.validate(values.username.value) ? removeNonNumeric(values.username.value) : null,
                passwordOne: values.passwordOne.value,
                passwordTwo: values.passwordTwo.value
            }
            const result = await callEndPoint(serviceRequest.postItem<Token, SignUpCredentials>(paths.auth.signUp, credentials));
            setResponse(result);
        }

    }

    const handleOnFocus = (name: string) => {
        setErrorResponse('');
        onFocus(name);
    }

    const isButtonDisabled = (values.username.value.trim() === '' || values.passwordOne.value.trim() === '' || values.passwordTwo.value.trim() === '');


    return(
        <>
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
                                            errorMessage={ values.username.error }
                                            />
                                    </div>
                                    <div className="col-12">
                                        <ReusableInput 
                                            inputProps={{
                                                label: 'Password',
                                                name: 'passwordOne',
                                                type: 'password',
                                                value: values.passwordOne.value,
                                                placeholder: 'Enter your password'
                                            }}
                                            onChange={handleChange}
                                            onFocus={onFocus}/>
                                            <PasswordRulesList rules={values.passwordOne.validation} value={values.passwordOne.value}/>
                                    </div>
                                    <div className="col-12">
                                        <ReusableInput 
                                            inputProps={{
                                                label: 'Confirm password',
                                                name: 'passwordTwo',
                                                type: 'password',
                                                value: values.passwordTwo.value,
                                                placeholder: 'Enter your password again'
                                            }}
                                            onChange={handleChange}
                                            onFocus={onFocus}/>
                                            <PasswordRulesList rules={values.passwordTwo.validation} value={values.passwordTwo.value}/>
                                            <div className={`text-danger errormessage ${error ? '' : 'd-none'}`}>{ error }</div>
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
        </>
    )
}