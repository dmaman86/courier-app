import React, { useCallback, useEffect, useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import { useErrorBoundary } from 'react-error-boundary';

import { User, Role, FormState, OptionType, Client, Branch, OfficeResponse, BranchOptionType, FetchResponse } from '@/types';
import { paths, validatorForm } from '@/helpers';
import { useAsync, useAuth, useFetchAndLoad, useForm } from '@/hooks';
import { ReusableInput, ReusableSelect } from '@/components/shared';
import { serviceRequest } from '@/services';

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

const transformOptionsToRoles = (options: MultiValue<OptionType> | SingleValue<OptionType>): Role[] => {
    if (Array.isArray(options)) {
      return options.map(option => ({ id: option.value, name: option.label }));
    }
    if (options) {
      return [{ id: (options as OptionType).value, name: (options as OptionType).label }];
    }
    return [];
};

const transformOptionsToBranches = (options: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>): Branch[] => {
    if(Array.isArray(options)){
        return options.map(option => {
            const [ city, address ] = option.label.split('\n');
            return { id: option.value, city, address }
        });
    }
    if(options){
        const [ city, address ] = (options as BranchOptionType).label.split('\n');
        return [{ id: (options as BranchOptionType).value, city, address }];
    }
        
    return [];
}


export const UserForm = ({ userId, onSubmit }: UserFormProps) => {

    const { userDetails } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ user, setUser ] = useState<User | Client | null>(null);

    const [ isClient, setIsClient ] = useState<boolean>(false);

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const [ formData, setFormData ] = useState<Client>({
        id: user?.id || 0,
        email: user?.email || '',
        name: user?.name || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        roles: user?.roles || [],
        office: { id: 0, name: ''},
        branches: []
    });

    const [ roles, setRoles ] = useState<Role[]>([]);
    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);
    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);

    const [ initialState, setInitialState ] = useState<FormState>({
        name: {
            value: formData.name,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        },
        lastName: {
            value: formData.lastName,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        },
        email: {
            value: formData.email,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.isEmail
            ],
            validateRealTime: false
        },
        phone: {
            value: formData.phone,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.isCellularNumber
            ],
            validateRealTime: false
        }
    });

    const { values, handleChange, onFocus, validateForm, setValues } = useForm(initialState);

    const fetchUserDetails = async() => {
        if(!userId) return Promise.resolve({ data: null, error: null });
        return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}id/${userId}`));
    }

    const handleUserDetailsSuccess = (response: FetchResponse<User | Client>) => {
        if(userId){
            if(response.data) setUser(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchUserDetails, handleUserDetailsSuccess, () => {}, [userId]);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    useEffect(() => {
        setIsClient(formData.roles.some(role => role.name === 'ROLE_CLIENT'));
    }, [formData.roles]);

    useEffect(() => {
        if(user !== null && selectedOffice === null){
            console.log(user);
            setFormData({
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                roles: user.roles,
                office: (user as Client).office || { id: 0, name: ''},
                branches: (user as Client).branches || []
            });

            setInitialState({
                name: {
                    value: user.name,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                },
                lastName: {
                    value: user.lastName,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                },
                email: {
                    value: user.email,
                    validation: [
                        validatorForm.validateNotEmpty,
                        validatorForm.isEmail
                    ],
                    validateRealTime: false
                },
                phone: {
                    value: user.phone,
                    validation: [
                        validatorForm.validateNotEmpty,
                        validatorForm.isCellularNumber
                    ],
                    validateRealTime: false
                }
            });

            setValues({
                name: {
                    value: user.name,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                },
                lastName: {
                    value: user.lastName,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                },
                email: {
                    value: user.email,
                    validation: [
                        validatorForm.validateNotEmpty,
                        validatorForm.isEmail
                    ],
                    validateRealTime: false
                },
                phone: {
                    value: user.phone,
                    validation: [
                        validatorForm.validateNotEmpty,
                        validatorForm.isCellularNumber
                    ],
                    validateRealTime: false
                }
            })

            if(user.roles.some(role => role.name === 'ROLE_CLIENT')){
                setSelectedOffice({
                    id: (user as Client).office.id,
                    name: (user as Client).office.name,
                    branches: (user as Client).branches
                })
            }
        }
    }, [user, selectedOffice]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            name: values.name.value,
            lastName: values.lastName.value,
            email: values.email.value,
            phone: values.phone.value,
        }));
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as Client);
        }
    }, [formData.id]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm() && formData.roles.length > 0){
            let formDataToSubmit: User | Client = { ...formData };

            if((formDataToSubmit as Client).office.id !== 0 && (formDataToSubmit as Client).branches.length > 0){
                formDataToSubmit = {
                    ...formDataToSubmit,
                    office: (formDataToSubmit as Client).office,
                    branches: (formDataToSubmit as Client).branches
                } as Client;
            }else{
                const { office, branches, ...userData } = formDataToSubmit;
                formDataToSubmit = userData as User;
            }
            console.log('Form is valid', formDataToSubmit);
            onSubmit(formDataToSubmit);
        }
    }, [validateForm, formData, onSubmit]);

    const handleRoleChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        const updateRoles = transformOptionsToRoles(selected);
        setFormData({
            ...formData,
            roles: updateRoles
        });
    }, [formData]);

    const handleOfficeChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        const office = offices.find(office => office.id === (selected as OptionType).value) || null;
        setSelectedOffice(office);
        setFormData({
            ...formData,
            office: office ? { id: office.id, name: office.name } : { id: 0, name: '' },
            branches: []
        });
    }, [offices, formData]);

    const handleBranchChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(Array.isArray(selected)){
            setFormData({
                ...formData,
                branches: transformOptionsToBranches(selected)
            });
        }
    }, [formData]);

    const isCurrentUser = userDetails?.id === formData.id;

    const fetchRoles = async() => await callEndPoint(serviceRequest.getItem<Role[]>(`${paths.courier.roles}all`));

    const handleRoleSuccess = (response: FetchResponse<Role[]>) => {
        if(response.data) setRoles(response.data);
        else showBoundary(response.error);
    }

    useAsync(fetchRoles, handleRoleSuccess, () => {}, []);

    const fetchOffices = async() => await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}all`));

    const handleOfficesSuccess = (response: FetchResponse<OfficeResponse[]>) => {
        if(response.data) setOffices(response.data);
        else showBoundary(response.error);
    }

    useAsync(fetchOffices, handleOfficesSuccess, () => {}, []);

    return(
        <>
            <form onSubmit={handleSubmit} className='row g-4'>
                <div className='col-6'>
                    <ReusableInput
                        inputProps={{
                            label: 'Name',
                            name: 'name',
                            type: 'text',
                            value: values.name.value,
                            placeholder: 'Enter your name'
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
                            placeholder: 'Enter your last name'
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
                                placeholder: 'Enter your email'
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
                                placeholder: 'Enter your phone'
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
                                    value={formData.roles.map(role => ({ value: role.id, label: role.name }))}
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
                                        value={formData.office ? { value: formData.office.id, label: formData.office.name }: null }
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
                                        value={formData.branches.map(branch => ({ value: branch.id, label: `${branch.city}\n${branch.address}`, address: branch.address }))}
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
        </>
    )
}