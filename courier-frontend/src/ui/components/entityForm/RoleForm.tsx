import { ReusableInput } from "../form";
import { FormProps, FormState, Role } from "@/domain";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";


export const RoleForm = <T extends Role>({ item, onSubmit, onClose }: FormProps<T>) => {

    const initialState: FormState = {
        name: {
            value: item.name,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        }
    };

    const { values, state, handleChange, onFocus, validateForm } = useForm(item, initialState);

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
                            { onClose && (<button className='btn btn-secondary ms-2' onClick={onClose}>Cancel</button>) }
                        </div>
                    </form>
                )
            }
        </>
    );
}