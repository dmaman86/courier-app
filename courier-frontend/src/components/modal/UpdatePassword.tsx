import { useForm } from "../../hooks";
import { FormState, User } from "../../types";
import { validatorForm } from "../../helpers";
import { PasswordRulesList } from "../partials/PasswordRulesList";
import { ReusableInput } from "../shared";



const initialState: FormState = {
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
};

interface UpdatePasswordProps {
    user: User | null;
    onClose: () => void;
}

export const UpdatePassword = ({user, onClose}: UpdatePasswordProps) => {

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const { newPassword, confirmPassword } = values;

    const { value: newPasswordValue, error: newPasswordErrors } = newPassword;
    const { value: confirmPasswordValue, error: confirmPasswordErrors } = confirmPassword;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm()){
            console.log(newPasswordValue, confirmPasswordValue);
        }else{
            console.log('Form is not valid: ', newPasswordErrors, confirmPasswordErrors);
        }

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
                            label: 'Password',
                            name: 'newPassword',
                            type: 'password',
                            value: newPasswordValue,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}/>
                        <PasswordRulesList rules={newPassword.validation} errors={newPassword.error}/>
                </div>
                <div className="col-12">
                    <ReusableInput 
                        inputProps={{
                            label: 'Confirm password',
                            name: 'confirmPassword',
                            type: 'password',
                            value: confirmPasswordValue,
                            placeholder: 'Enter your password again'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}/>
                        <PasswordRulesList rules={confirmPassword.validation} errors={confirmPassword.error}/>
                </div>
                <div className="col pt-3 text-center">
                    <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </form>
        </>
    )
}