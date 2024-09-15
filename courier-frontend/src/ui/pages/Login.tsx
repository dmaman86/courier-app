import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";


import { useAuth } from "@/hooks";
import { FormState } from "@/domain";
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

    const { 
        values,
        state,
        handleChange,
        onFocus,
        validateForm,
        credentials,
        setCredentials,
        errorResponse,
        authenticate,
        setErrorResponse
    } = useAuthForm<LoginCredentials>(initialCredentials, initialStateForm);

    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');

    useEffect(() => {
        const login = async () => {
            if (credentials) {
                await authenticate(credentials, false);
            }
        };
    
        login();
    }, [credentials]);

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userValid = validateForm();
        if(userValid && errorResponse === ''){
            const email = userValid.email;
            setCredentials({
                email: isCellularNumber.isValid(email) ? '' : email,
                phone: isCellularNumber.isValid(email) ? removeNonNumeric(email) : '',
                password: userValid.password
            });
        }
    }

    useEffect(() => {
        if(userDetails){
            navigate('/home', { replace: true });
        }
    }, [userDetails]);

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
                                                errorResponse !== '' && <div className="text-danger text-center">{errorResponse}</div>
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