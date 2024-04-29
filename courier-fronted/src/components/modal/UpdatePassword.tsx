import { useForm } from "../../hooks";
import { FormState, User } from "../../types";
import { ReusableInput } from "../shared";
import { validatorForm } from "../../helpers";


const initialState: FormState = {
    passwordOne: {
        value: '',
        validation: [
            validatorForm.validaNotEmpty
        ]
    },
    passwordTwo: {
        value: '',
        validation: [
            validatorForm.validaNotEmpty
        ]
    }
};

interface UpdatePasswordProps {
    user: User | null;
    onClose: () => void;
}

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({user, onClose}) => {

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm()){
            console.log('Updating password');
            onClose();
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
                            label: 'password one',
                            name: 'passwordOne',
                            type: 'password',
                            value: values.passwordOne.value,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}
                        errorMessage={values.passwordOne.error}/>
                </div>
                <div className="col-12">
                    <ReusableInput 
                        inputProps={{
                            label: 'password two',
                            name: 'passwordTwo',
                            type: 'password',
                            value: values.passwordTwo.value,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}
                        errorMessage={values.passwordTwo.error}/>
                </div>
                <div className="col pt-3 text-center">
                    <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </form>
        </>
    )
}