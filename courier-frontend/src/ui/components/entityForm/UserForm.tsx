import { useEffect, useState } from "react";

import { ReusableInput, SelectDetailsForm } from "../form";
import { Branch, BranchOptionType, Client, FetchResponse, FormProps, FormState, Office, OfficeResponse, OptionType, Role, User } from "@/domain";
import { paths, validatorForm } from "@/helpers";
import { useAsync, useAuth, useFetchAndLoad, useForm } from "@/hooks";
import { serviceRequest } from "@/services";

export const UserForm = <T extends User, R extends T = T>({ item, onSubmit }: FormProps<T, R>) => {

    const { userDetails } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();

    const [ response, setResponse ] = useState<FetchResponse<User | Client>>({
        data: null,
        error: null
    });

    const initialFormState: FormState = {
        name: {
            value: item.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        lastName: {
            value: item.lastName,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        },
        email: {
            value: item.email,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.isEmail
            ],
            validateRealTime: false
        },
        phone: {
            value: item.phone,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.isCellularNumber
            ],
            validateRealTime: false
        },
        roles: {
            value: item.roles,
            validation: [{
                isValid: (value: Role[]) => value.length > 0,
                message: 'Select at least one role'
            }],
            validateRealTime: false
        },
        office: {
            value: { id: 0, name: '' },
            validation: [{
                isValid: (value: Office): boolean => value.id !== 0,
                message: 'Select an office'
            }],
            validateRealTime: false
        },
        branches: {
            value: [],
            validation: [{
                isValid: (branches: Branch[]): boolean => branches.length > 0,
                message: 'At least one branch must be specified'
            }],
            validateRealTime: false
        }
    }

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    const [ isClient, setIsClient ] = useState<boolean>(false);
    const [ isCurrentUser, setIsCurrentUser ] = useState<boolean>(false);
    const [ branches, setBranches ] = useState<Branch[] | null>(null);

    const { values, state, handleChange, handleStateChange, onFocus, validateForm, setState, setValues } = useForm<Client, FormState>(item as Client, initialFormState);

    const fetchUserDetails = async() => {
        if(item.id !== 0){
            return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}id/${item.id}`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    useAsync(fetchUserDetails, setResponse, () => {}, [item.id]);

    useEffect(() => {
        if(!loading && response.data){
            console.log(response.data);
            if(response.data.roles.some(role => role.name === 'ROLE_CLIENT')){
                const client = response.data as Client;
                setState((prev) => ({
                    ...prev,
                    office: client.office,
                    branches: client.branches
                }));
            }
        }
    }, [loading, response]);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
            setIsCurrentUser(item.id === userDetails.id);
        }
    }, [userDetails]);

    useEffect(() => {
        setIsClient(state.roles.some(role => role.name === 'ROLE_CLIENT'));
    }, [state.roles]);

    useEffect(() => {
        const newValues = { ...values };
        if(isClient){
            
            newValues.office = {
                value: state.office,
                validation: [{
                    isValid: (value: Office): boolean => value.id !== 0,
                    message: 'Select an office'
                }],
                validateRealTime: false
            };
            newValues.branches = {
                value: state.branches,
                validation: [{
                    isValid: (branches: Branch[]): boolean => branches.length > 0,
                    message: 'At least one branch must be specified'
                }],
                validateRealTime: false
            };
        }else{
            newValues.office = {
                value: state.office,
                validation: [],
                validateRealTime: false
            };
            newValues.branches = {
                value: state.branches,
                validation: [],
                validateRealTime: false
            };
        }
        setValues(newValues);
    }, [isClient]);


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newUser = validateForm();
        console.log(state);
        if(newUser){
            /*if(!newUser.roles.some(role => role.name === 'CLIENT_ROLE')){
                const { office, branches, ...res } = newUser;
                onSubmit(res);
            }
            onSubmit(newUser);*/
            onSubmit(newUser as T | R);
        }
    }

    useEffect(() => {
        console.log(item);
        console.log(state);
        console.log(values);
    }, [item, state, values]);


    return(
        <>
            {
                values && (
                    <form onSubmit={handleFormSubmit} className='row g-4'>
                        <div className='col-6'>
                            <ReusableInput
                                inputProps={{
                                    label: 'Name',
                                    name: 'name',
                                    type: 'text',
                                    value: state.name,
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
                                    value: state.lastName,
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
                                        value: state.email,
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
                                        value: state.phone,
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
                                        <SelectDetailsForm<OptionType, Role>
                                            label='Select Roles:'
                                            initialData={state.roles.map(role => ({ value: role.id, label: role.name }))}
                                            listOptions={null}
                                            formatLabel={(item: Role) => ({ value: item.id, label: item.name })}
                                            transformData={(selected) => {
                                               if(Array.isArray(selected)){
                                                    const roles = selected.map(role => ({
                                                        id: role.value,
                                                        name: role.label
                                                    }));
                                                    handleStateChange('roles', roles, roles);
                                               }
                                            }}
                                            isMulti={true}
                                            fetchItem={() => serviceRequest.getItem<Role[]>(`${paths.courier.roles}all`)}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        {
                            (isAdmin && isClient && state.office) && (
                                <>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <SelectDetailsForm<OptionType, OfficeResponse>
                                                label='Select Office:'
                                                initialData={{
                                                    value: state.office.id,
                                                    label: state.office.name
                                                }}
                                                listOptions={null}
                                                formatLabel={(office: OfficeResponse) => ({
                                                    value: office.id,
                                                    label: office.name,
                                                    branches: office.branches
                                                })}
                                                transformData={(selected) => {
                                                    console.log(selected);
                                                    if(!Array.isArray(selected)){
                                                        const office: Office = {
                                                            id: (selected as OptionType).value,
                                                            name: (selected as OptionType).label
                                                        }
                                                        handleStateChange('office', office, office);
                                                        setBranches((selected as OfficeResponse).branches as Branch[]);
                                                    }
                                                }}
                                                isMulti={false}
                                                fetchItem={() => serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}all`)}
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            {
                                                (branches || state.branches.length > 0) && (
                                                    <SelectDetailsForm<BranchOptionType> 
                                                        label='Select Branches:'
                                                        initialData={state.branches.map(branch => ({ 
                                                            value: branch.id, 
                                                            label: `${branch.city}\n${branch.address}`, 
                                                            address: branch.address,
                                                            // office: state.office
                                                        }))}
                                                        listOptions={branches ? branches.map(branch => ({
                                                            value: (branch as Branch).id,
                                                            label: `${branch.city}\n${branch.address}`,
                                                            address: branch.address,
                                                            // office: state.office
                                                        })) : []}
                                                        transformData={(selected) => {
                                                            if(Array.isArray(selected)){
                                                                const selectedBranches: Branch[] = selected.map(branch => ({
                                                                    id: branch.value,
                                                                    city: branch.label.split('\n')[0],
                                                                    address: branch.address,
                                                                }));
                                                                handleStateChange('branches', selectedBranches, selectedBranches);
                                                            }
                                                        }}
                                                        isMulti={true}
                                                    />
                                                )
                                            }
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