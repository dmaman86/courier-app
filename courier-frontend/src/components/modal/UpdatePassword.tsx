import { useEffect, useState } from "react";

import { useForm } from "../../hooks";
import { FormState, User } from "../../types";
import { validatorForm } from "../../helpers";
import { PasswordRulesList } from "../partials/PasswordRulesList";
import { ReusableInput } from "../shared";



const initialState: FormState = {
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
};

interface UpdatePasswordProps {
    user: User | null;
    onClose: () => void;
}

const validateEquals = (valueOne: string, valueTwo: string) => {
    return {
        isValid: valueOne === valueTwo,
        error: 'Passwords must be equal'
    }
}

export const UpdatePassword = ({user, onClose}: UpdatePasswordProps) => {

    const { values, handleChange, onFocus } = useForm(initialState);

    const { passwordOne, passwordTwo } = values;

    const { value: passwordOneValue, error: passwordOneError } = passwordOne;
    const { value: passwordTwoValue, error: passwordTwoError } = passwordTwo;

    const [ error, setError ] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(error === '' && validateErrors()){
            console.log(passwordOneValue, passwordTwoValue, error);
        }else{
            console.log('Form is not valid: ', passwordOneError, passwordTwoError, error);
        }

    }

    useEffect( () => {
        if(passwordOneValue !== '' && passwordTwoValue !== ''){
            const res = validateEquals(passwordOneValue, passwordTwoValue);
            !res.isValid ? setError(res.error) : setError('');
        }
    }, [passwordOneValue, passwordTwoValue]);

    const validateErrors = () => {
        return passwordOneError === '' && passwordTwoError === '';
    }

    return(
        <>
            <form onSubmit={ handleSubmit } className="row g-4">
                <div className="col-12">
                    <h4>
                        Username: <span>{ user?.email }</span>
                    </h4>
                </div>

                <div className="col-12">
                    <ReusableInput 
                        inputProps={{
                            label: 'password one',
                            name: 'passwordOne',
                            type: 'password',
                            value: passwordOneValue,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}/>
                        <PasswordRulesList rules={passwordOne.validation} value={passwordOneValue}/>
                </div>
                <div className="col-12">
                    <ReusableInput 
                        inputProps={{
                            label: 'password two',
                            name: 'passwordTwo',
                            type: 'password',
                            value: passwordTwoValue,
                            placeholder: 'Enter your password again'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}/>
                        <PasswordRulesList rules={passwordTwo.validation} value={passwordTwoValue}/>
                        {error !== '' && (
                            <div className="text-danger errormessage">{error}</div>
                        )}
                </div>
                <div className="col pt-3 text-center">
                    <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </form>
        </>
    )
}