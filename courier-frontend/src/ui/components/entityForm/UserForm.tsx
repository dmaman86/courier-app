import { ReusableInput, ReusableSelect } from "../form";
import { Branch, BranchOptionType, Client, OfficeResponse, OptionType, Role, User } from "@/domain";
import { useUserForm } from "@/useCases";


interface UserFormProps {
    userId: number| null;
    onSubmit: (user: User | Client) => void;
}

const tranformRoles = (roles: Role[]): OptionType[] => {
    return roles.map(role => ({ value: role.id, label: role.name }));
}

const tranformOffices = (offices: OfficeResponse[]): OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

export const UserForm = ({ userId, onSubmit }: UserFormProps) => {

    const { loading,
            user,
            roles,
            offices,
            selectedOffice,
            isClient,
            isAdmin,
            isCurrentUser,
            values,
            handleChange,
            onFocus,
            handleSubmit,
            handleRoleChange,
            handleOfficeChange,
            handleBranchChange } = useUserForm(userId);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = handleSubmit();
        if(user)
            onSubmit(user);
    }


    return(
        <>
            {
                (user && values) && (
                    <form onSubmit={handleFormSubmit} className='row g-4'>
                        <div className='col-6'>
                            <ReusableInput
                                inputProps={{
                                    label: 'Name',
                                    name: 'name',
                                    type: 'text',
                                    value: values.name.value,
                                    placeholder: 'Enter user name'
                                }}
                                onChange={handleChange}
                                onFocus={onFocus}
                                errorsMessage={values.name.error}
                            />    
                        </div>
                        <div className='col-6'>
                            <ReusableInput
                                inputProps={{
                                    label: 'Last Name',
                                    name: 'lastName',
                                    type: 'text',
                                    value: values.lastName.value,
                                    placeholder: 'Enter user last name'
                                }}
                                onChange={handleChange}
                                onFocus={onFocus}
                                errorsMessage={values.lastName.error}
                            />    
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <ReusableInput
                                    inputProps={{
                                        label: 'Email',
                                        name: 'email',
                                        type: 'email',
                                        value: values.email.value,
                                        placeholder: 'Enter user email'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.email.error}
                                />    
                            </div>
                            <div className='col-6'>
                                <ReusableInput
                                    inputProps={{
                                        label: 'Phone',
                                        name: 'phone',
                                        type: 'tel',
                                        value: values.phone.value,
                                        placeholder: 'Enter user phone'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.phone.error}
                                />    
                            </div>
                        </div>
                        {
                            (isAdmin && !isCurrentUser) && (
                                <div className='row'>
                                    <div className='col-12'>
                                        <ReusableSelect<OptionType>
                                            label='Select Roles:'
                                            value={user.roles.map(role => ({ value: role.id, label: role.name }))}
                                            options={tranformRoles(roles)}
                                            onChange={handleRoleChange}
                                            isMulti
                                            />
                                    </div>
                                </div>
                            )
                        }
                        {
                            (isAdmin && isClient) && (
                                <>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <ReusableSelect<OptionType> 
                                                label='Select Office:'
                                                value={(user as Client).office ? { value: (user as Client).office.id, label: (user as Client).office.name }: null }
                                                options={tranformOffices(offices)}
                                                onChange={handleOfficeChange}
                                                isMulti={false}
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <ReusableSelect<BranchOptionType>
                                                label='Select Branches:'
                                                value={(user as Client).branches ? (user as Client).branches.map(branch => ({ value: branch.id, label: `${branch.city}\n${branch.address}`, address: branch.address })) : []}
                                                options={selectedOffice ? selectedOffice.branches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address })) : []}
                                                onChange={handleBranchChange}
                                                isMulti
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                        }
                        <div className='col pt-3 text-center'>
                            <button className='btn btn-primary' type='submit'>Save</button>
                        </div>
                    </form>
                )
            }
        </>
    )

};