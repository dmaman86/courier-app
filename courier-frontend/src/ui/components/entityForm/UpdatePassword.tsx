import { ReusableInput } from "../form";
import { FormState, User } from "@/domain";
import { PasswordRulesList } from "../layout";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";


interface UpdatePasswordProps {
    user: User | null;
    onClose: () => void;
}

interface UpdatePasswordForm {
    password: string;
    confirmPassword: string;
}

export const UpdatePassword = ({ user, onClose }: UpdatePasswordProps) => {

    const initUpdatePassword: UpdatePasswordForm = {
        password: '',
        confirmPassword: ''
    }
    
    const initialState: FormState = {
        password: {
            value: initUpdatePassword.password,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.validateMinLength
            ],
            validateRealTime: true
        },
        confirmPassword: {
            value: initUpdatePassword.confirmPassword,
            validation: [
                validatorForm.validateMinLength,
                validatorForm.isEqual('password')
            ],
            validateRealTime: true
        }
    };

    const { values, state, handleChange, onFocus, validateForm } = useForm(initUpdatePassword, initialState);


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const credentials = validateForm();
        if(credentials){
            console.log(credentials);
            onClose();
        }
    }

    return(
        <>
            <form onSubmit={ handleFormSubmit } className="row g-4">
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
                            value: state.password,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}/>
                        <PasswordRulesList rules={values?.password.validation!} errors={values?.password.error}/>
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
                        <PasswordRulesList rules={values?.confirmPassword.validation!} errors={values?.confirmPassword.error}/>
                </div>
                <div className="col pt-3 text-center">
                    <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </form>
        </>
    )
};