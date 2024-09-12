import { ReusableInput } from "../form";
import { FormState, Role } from "@/domain";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";


interface RoleFormProps {
    role: Role;
    setRole: (role: Role) => void;
    onSubmit: (role: Role) => void;
}

export const RoleForm = ({ role, setRole, onSubmit }: RoleFormProps) => {

    const initialState: FormState = {
        name: {
            value: role.name,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        }
    };

    const { values, state, handleChange, onFocus, validateForm } = useForm(role, initialState);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const role = validateForm();
        if(role)
            onSubmit(role);
    }

    return (
        <>
            {
                (values) && (
                    <form onSubmit={handleFormSubmit} className="row g-4">
                        <div className="col-6">
                            <ReusableInput
                                inputProps={{
                                    label: 'Role Name',
                                    name: 'name',
                                    type: 'text',
                                    value: state.name,
                                    placeholder: 'Enter role name'
                                }}
                                onChange={handleChange}
                                onFocus={onFocus}
                                errorsMessage={values.name.error}
                            />
                        </div>
                        <div className='col pt-3 text-center'>
                            <button className='btn btn-primary' type='submit'>Save</button>
                        </div>
                    </form>
                )
            }
        </>
    );
}