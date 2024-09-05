import { ReusableInput } from "../form";
import { User } from "@/domain";
import { useUpdatePasswordForm } from "@/useCases";
import { PasswordRulesList } from "../layout";



interface UpdatePasswordProps {
    user: User | null;
    onClose: () => void;
}

export const UpdatePassword = ({ user, onClose }: UpdatePasswordProps) => {

    const { values,
        handleChange,
        onFocus,
        handleSubmit } = useUpdatePasswordForm();


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = handleSubmit();
        if(user){
            console.log(user);
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
                            value: values?.newPassword.value!,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}/>
                        <PasswordRulesList rules={values?.newPassword.validation!} errors={values?.newPassword.error}/>
                </div>
                <div className="col-12">
                    <ReusableInput 
                        inputProps={{
                            label: 'Confirm password',
                            name: 'confirmPassword',
                            type: 'password',
                            value: values?.confirmPassword.value!,
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