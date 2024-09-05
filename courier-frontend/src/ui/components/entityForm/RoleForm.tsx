import { ReusableInput } from "../form";
import { Role } from "@/domain";
import { useRoleForm } from "@/useCases";


interface RoleFormProps {
    roleId: number | null;
    onSubmit: (role: Role) => void;
}

export const RoleForm = ({ roleId, onSubmit }: RoleFormProps) => {

    const { loading,
            formData,
            values,
            handleChange,
            onFocus,
            handleSubmit } = useRoleForm(roleId);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const role = handleSubmit();
        if(role)
            onSubmit(role);
    }

    return (
        <>
            {
                (!loading && values) && (
                    <form onSubmit={handleFormSubmit} className="row g-4">
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