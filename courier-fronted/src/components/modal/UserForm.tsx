import React, { useCallback, useEffect, useState } from 'react';

import { User, Role, FormState, OptionType } from '../../types';
import { paths, validatorForm } from '../../helpers';
import { useAuth, useFetchAndLoad, useForm } from '../../hooks';
import { ReusableInput, ReusableSelect } from '../shared';
import { serviceRequest } from '../../services';
import { MultiValue, SingleValue } from 'react-select';

interface UserFormProps {
    user?: User | null;
    onSubmit: (user: User) => void;
}

const tranformRoles = (roles: Role[]): OptionType[] => {
    return roles.map(role => ({ value: role.id, label: role.name }));
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


export const UserForm = ({ user, onSubmit }: UserFormProps) => {

    const { userDetails } = useAuth();

    const [ formData, setFormData ] = useState<User>({
        id: user?.id || 0,
        email: user?.email || '',
        name: user?.name || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        roles: user?.roles || []
    });

    const [ roles, setRoles ] = useState<Role[]>([]);

    const { loading, callEndPoint } = useFetchAndLoad();

    const initialState: FormState = {
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
    }

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm() && formData.roles.length > 0){
            console.log('Form is valid');
            onSubmit(formData);
        }
    }

    const handleRoleChange = (selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        setFormData({
            ...formData,
            roles: transformOptionsToRoles(selected)
        })
    };

    const isCurrentUser = userDetails?.id === formData.id;

    const fetchRoles = useCallback(async() => {
        const response = await callEndPoint(serviceRequest.getItem(paths.courier.roles));
        if(response.data){
            setRoles(response.data as Role[]);
        }
    }, [callEndPoint]);

    useEffect(() => {
        if(!isCurrentUser && roles.length === 0){
            fetchRoles();
        }
    }, [fetchRoles, isCurrentUser, roles]);

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
                        errorMessage={values.name.error}
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
                        errorMessage={values.lastName.error}
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
                            errorMessage={values.email.error}
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
                            errorMessage={values.phone.error}
                        />    
                    </div>
                </div>
                {
                    (!isCurrentUser && !loading) && (
                        <div className='row'>
                            <div className='col-12'>
                                <ReusableSelect
                                    value={formData.roles.map(role => ({ value: role.id, label: role.name }))}
                                    options={tranformRoles(roles)}
                                    onChange={handleRoleChange}
                                    isMulti
                                    />
                            </div>
                        </div>
                    )
                }
                <div className='col pt-3 text-center'>
                    <button className='btn btn-primary' type='submit'>Save</button>
                </div>
            </form>
        </>
    )
}