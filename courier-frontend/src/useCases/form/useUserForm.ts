import { useCallback, useEffect, useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import { useErrorBoundary } from 'react-error-boundary';

import { User, Role, FormState, OptionType, Client, Branch, OfficeResponse, BranchOptionType, FetchResponse } from '@/domain';
import { paths, validatorForm } from '@/helpers';
import { useAsync, useAuth, useFetchAndLoad, useForm } from '@/hooks';
import { ReusableInput, ReusableSelect } from '@/components/shared';
import { serviceRequest } from '@/services';



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

export const useUserForm = (userId: number | null) => {

    const { userDetails } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ user, setUser ] = useState<User | Client | null>(null);

    const [ isClient, setIsClient ] = useState<boolean>(false);

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const [ roles, setRoles ] = useState<Role[]>([]);
    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);
    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);

    const [ isCurrentUser, setIsCurrentUser ] = useState<boolean>(false);

    const [ initialState, setInitialState ] = useState<FormState | null>(null);

    const { values, handleChange, onFocus, validateForm, setValues, updateValues } = useForm(initialState);

    const [ isValidForm, setIsValidForm ] = useState<boolean>(false);

    const fetchUserDetails = async() => {
        if(!userId) return Promise.resolve({ data: null, error: null });
        return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}id/${userId}`));
    }

    const handleUserDetailsSuccess = (response: FetchResponse<User | Client>) => {
        if(userId){
            if(response.data){
                setUser(response.data);
                setIsClient(response.data.roles.some(role => role.name === 'ROLE_CLIENT'));
            }
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

    const updateInitialState = useCallback((user: User | Client) => {
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
        })
    }, []);

    useEffect(() => {
        if(!userId && !user){
            setUser({
                id: 0,
                email: '',
                name: '',
                lastName: '',
                phone: '',
                roles: [],
                office: { id: 0, name: ''},
                branches: [],
                isActive: true
            });
        }else{
            if(user && user.id === 0){
                const { id, ...rest } = user;
                setUser(rest as Client);
            }
        }
    }, [userId, user]);

    useEffect(() => {
        if(isClient && (user as Client).office && (user as Client).office.id !== 0 && !selectedOffice){
            setSelectedOffice({
                id: (user as Client).office.id,
                name: (user as Client).office.name,
                branches: (user as Client).branches
            });
        }
    }, [isClient, user, selectedOffice]);

    useEffect(() => {
        if(user && !initialState){
            console.log(user);
            updateInitialState(user);
        }
    }, [user, initialState, updateInitialState]);

    useEffect(() => {
        if(initialState) updateValues(initialState);
    }, [initialState, updateValues]);

    useEffect(() => {
        if(values && user){
            const updateUser = {
                ...user,
                name: values.name.value,
                lastName: values.lastName.value,
                email: values.email.value,
                phone: values.phone.value
            }
            setUser(updateUser);
        }
    }, [values]);

    const handleSubmit = () => {
        if(user){
            const v1 = validateForm() && user.roles.length > 0;
            if(isClient){
                const v2 = (user as Client).office.id !== 0 && (user as Client).branches.length > 0;
                // setIsValidForm(v1 && v2);\
                return v1 && v2 ? user : null;
            }else{
                // setIsValidForm(v1);
                const { office, branches, ...userData } = user as Client;
                return v1 ? userData : null;
                // setUser(userData);
            }
        }
        return null;
    }

    const handleRoleChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if(!selected) return;

        if(Array.isArray(selected) && user){
            const updateRoles = transformOptionsToRoles(selected);
            setUser({
                ...user,
                roles: updateRoles
            });
            setIsClient(updateRoles.some(role => role.name === 'ROLE_CLIENT'));
        }
    }, [user]);

    const handleOfficeChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        const office = offices.find(office => office.id === (selected as OptionType).value);
        
        if(user && office){
            setSelectedOffice(office);
            setUser({
                ...user,
                office: { id: office.id, name: office.name },
                branches: []
            });
        }
    }, [offices, user]);

    const handleBranchChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(Array.isArray(selected) && user){
            setUser({
                ...user,
                branches: transformOptionsToBranches(selected)
            });
        }
    }, [user]);

    useEffect(() => {
        if(user && userDetails){
            setIsCurrentUser(user.id === userDetails.id);
        }
    }, [user, userDetails]);

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

    return {
        loading,
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
        handleBranchChange
    }

}