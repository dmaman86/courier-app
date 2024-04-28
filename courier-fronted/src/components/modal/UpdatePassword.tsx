import { useForm } from "../../hooks";
import { FormState, User } from "../../types";
import { ReusableInput } from "../shared";


const initialState: FormState = {
    password: {
        value: '',
        validation: [
            {
                validate: (value: string) => value.length > 0,
                errorMessage: 'Password is required'
            }
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
                            label: 'password',
                            name: 'password',
                            type: 'password',
                            value: values.password.value,
                            placeholder: 'Enter your password'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}
                        errorMessage={values.password.error}/>
                </div>
                <div className="col pt-3 text-center">
                    <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </form>
        </>
    )
}