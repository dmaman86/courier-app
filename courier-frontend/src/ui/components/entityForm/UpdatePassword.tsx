import { FormProps, FormState, UpdatePasswordForm } from "@/domain";
import { PasswordRulesList } from "../layout";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";
import { ReusableInput } from "../form";

export const UpdatePassword = <T extends UpdatePasswordForm, R extends T = T>({ item, onSubmit, onClose }: FormProps<T, R>) => {
    
    const initialState: FormState = {
        password: {
            value: item.password,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.validateMinLength
            ],
            validateRealTime: true
        },
        confirmPassword: {
            value: item.confirmPassword,
            validation: [
                validatorForm.validateMinLength,
                validatorForm.isEqual('password')
            ],
            validateRealTime: true
        }
    };

    const { values, state, handleChange, onFocus, validateForm } = useForm(item, initialState);


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const credentials = validateForm();
        if(credentials){
            console.log(credentials);
            onSubmit(credentials as T);
        }
    }

    return(
        <>
            <form onSubmit={ handleFormSubmit } className="row g-4">
                <div className="col-12">
                    <h4>
                        Username: <span>{ state.email }</span>
                    </h4>
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
                    { onClose && (<button className='btn btn-secondary ms-2' onClick={onClose}>Cancel</button>) }
                </div>
            </form>
        </>
    )
};