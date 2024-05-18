import { useEffect, useState } from "react";
import { FormState, Role } from "../../types";
import { validatorForm } from "../../helpers";
import { useForm } from "../../hooks";
import { ReusableInput } from "../shared";


interface RoleFormProps {
    role?: Role | null;
    onSubmit: (role: Role) => void;
}

export const RoleForm = ({ role, onSubmit }: RoleFormProps) => {

    const [ formData, setFormData ] = useState<Role>({
        id: role?.id || 0,
        name: role?.name || ''
    });

    const initialState: FormState = {
        name: {
            value: formData.name,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        }
    };

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    useEffect(() => {
        setFormData({
            ...formData,
            name: values.name.value
        });
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as Role);
        }
    }, [formData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm()){
            onSubmit(formData);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-6">
                    <ReusableInput 
                        inputProps={{
                            label: 'Role Name',
                            name: 'name',
                            type: 'text',
                            value: values.name.value,
                            placeholder: 'Enter role name'
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}
                        errorMessage={values.name.error}
                    />
                </div>
                <div className='col pt-3 text-center'>
                    <button className='btn btn-primary' type='submit'>Save</button>
                </div>
            </form>
        </>
    );
}