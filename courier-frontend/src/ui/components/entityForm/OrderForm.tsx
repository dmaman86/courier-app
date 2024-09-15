import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";

import { ReusableInput, SelectDetailsForm } from "../form";
import { Branch, BranchResponse, Client, Contact, ContactOptionType, 
        FetchResponse, FormProps, FormState, Office, OfficeResponse, 
        OptionType, Order, StatusOrder, User } from "@/domain";

import { useAsync, useAuth, useFetchAndLoad, useForm } from '@/hooks';
import { serviceRequest } from '@/services';
import { paths, validatorForm } from '@/helpers';

interface BranchOptionType extends OptionType {
    address: string;
    office: Office;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
};

const tranformOffices = (offices: OfficeResponse[]): readonly OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

const createBranchResponseFromClient = (client: Client): BranchResponse[] => {
    return client.branches.map((branch) => ({
        id: branch.id,
        city: branch.city,
        address: branch.address,
        office: client.office!
    }));
}

export const OrderForm = <T extends Order>({ item, onSubmit, onClose }: FormProps<T>) => {

    const { userDetails } = useAuth();

    const { loading, callEndPoint } = useFetchAndLoad()

    const [ isClient, setIsClient ] = useState<boolean>(false);
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const [ branchesOrigin, setBranchesOrigin ] = useState<Branch[]>([]);

    const [ contacts, setContacts ] = useState<Contact[]>([]);
    const [ offices, setOffices ] = useState<OfficeResponse[]>([{ id: 0, name: 'Not Found', branches: [] }]);
    const [ officeDestination, setOfficeDestination ] = useState<OfficeResponse | null>(null);

    const [ autocompleteValue, setAutocompleteValue ] = useState<OptionType | null>(null);
    const [ query, setQuery ] = useState<string>('');
    const [ found, setFound ] = useState<boolean>(true);

    const debouncedQuery = useDebounce(query, 500);


    const initialState: FormState = {
        client: {
            value: item.client,
            validation: [{
                isValid: (value: User): boolean => value !== null && value.id !== 0,
                message: 'Client is required' 
            }],
            validateRealTime: false
        },
        originBranch: {
            value: item.originBranch,
            validation: [{
                isValid: (value: BranchResponse): boolean => value.id !== 0 && value.office.id !== 0,
                message: 'Origin Branch is required'
            }],
            validateRealTime: false
        },
        destinationBranch: {
            value: item.destinationBranch,
            validation: [{
                isValid: (value: BranchResponse): boolean => value !== null && value.id !== 0 && value.office.id !== 0,
                message: 'Destination Branch is required'
            }],
            validateRealTime: false
        },
        contacts: {
            value: item.contacts,
            validation: [{
                isValid: (value: Contact[]): boolean => value.length > 0,
                message: 'Contact is required'
            }],
            validateRealTime: false
        },
        deliveryDate: {
            value: item.deliveryDate,
            validation: [validatorForm.isDate, validatorForm.isSelectedDateValid],
            validateRealTime: false
        },
        receiverName: {
            value: item.receiverName,
            validation: [validatorForm.validateNotEmpty],
            validateRealTime: false
        },
        receiverPhone: {
            value: item.receiverPhone,
            validation: [validatorForm.validateNotEmpty, validatorForm.isCellularNumber],
            validateRealTime: false
        },
        destinationAddress: {
            value: item.destinationAddress,
            validation: [validatorForm.validateNotEmpty],
            validateRealTime: false
        },
        couriers: {
            value: item.couriers,
            validation: [{
                isValid: (value: User[]): boolean => value !== null && value.length > 0,
                message: 'Courier is required'
            }],
            validateRealTime: false
        },
        currentStatus: {
            value: item.currentStatus,
            validation: [{
                isValid: (value: StatusOrder): boolean => value.id !== 0,
                message: 'Status Order is required'
            }],
            validateRealTime: false
        }
    };

    const { values, state, handleChange, handleStateChange, onFocus, validateForm, setState } = useForm(item, initialState);

    useEffect(() => {
        console.log(item);
    }, [item]);

    useEffect(() => {
        if(item.destinationBranch){
            setOfficeDestination({
                id: item.destinationBranch.office.id,
                name: item.destinationBranch.office.name,
                branches: [{
                    id: item.destinationBranch.id,
                    city: item.destinationBranch.city,
                    address: item.destinationBranch.address
                }]
            })
        }
    }, []);

    useEffect(() => {
        if(officeDestination) console.log(officeDestination);
    }, [officeDestination]);

    // Set user role flags (isClient, isAdmin)
    useEffect(() => {
        if (userDetails) {
            setIsClient(userDetails.roles.some(role => role.name === 'ROLE_CLIENT'));
            setIsAdmin(userDetails.roles.some(role => role.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    useEffect(() => {
        if(userDetails && isClient){
            const client: User = state.client || {
                id: userDetails.id,
                name: userDetails.name,
                lastName: userDetails.lastName,
                email: userDetails.email,
                phone: userDetails.phone,
                roles: userDetails.roles,
                isActive: true
            };
            console.log(client);
            console.log(item.client);
            handleStateChange('client', client, client);
        }
    }, [userDetails, state.client, isClient]);

    useEffect(() => {
        if(userDetails && isClient && state.originBranch.id === 0){
            console.log(userDetails);
            const originBranch: BranchResponse = {
                id: (userDetails as Client).branches[0].id,
                city: (userDetails as Client).branches[0].city,
                address: (userDetails as Client).branches[0].address,
                office: (userDetails as Client).office
            };
            console.log(originBranch);
            setBranchesOrigin(createBranchResponseFromClient(userDetails as Client));
            handleStateChange('originBranch', originBranch, originBranch);
        }
    }, [userDetails, state.originBranch, isClient]);

    useEffect(() => {
        if(state.destinationBranch && state.destinationBranch.office){
            setAutocompleteValue({
                value: state.destinationBranch.office.id,
                label: state.destinationBranch.office.name
            });
        }
    }, [state.destinationBranch, state.destinationBranch?.office]);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const submittedData = validateForm();
        if(submittedData) onSubmit(submittedData);
        
    }

    const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
        setQuery(value);
    }

    // Search Offices
    const searchOffice = async (debouncedQuery: string): Promise<FetchResponse<OfficeResponse[]>> => {
        if (debouncedQuery) {
            return await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}search/name?query=${debouncedQuery}`));
        }
        return { data: null, error: null };
    };

    const handleSearchSuccess = (response: FetchResponse<OfficeResponse[]>) => {
        if (response.data) {
            setOffices([...response.data, { id: 0, name: 'Not Found', branches: [] }]);
        } else {
            setOffices([{ id: 0, name: 'Not Found', branches: [] }]);
        }
    };

    useAsync(() => searchOffice(debouncedQuery), handleSearchSuccess, () => {}, [debouncedQuery]);

    // Handle Office AutoComplete
    const handleOfficeAutoComplete = (event: React.SyntheticEvent<Element, Event>, value: OptionType | null) => {
        if (value) {
            setAutocompleteValue(value);
            if (value.value === 0) {
                setFound(false);
                handleStateChange('destinationBranch', null, null);
                setContacts([]);
                setOfficeDestination(null);
            } else {
                setFound(true);
                const office = offices.find(office => office.id === value.value);
                console.log(office);
                office && setOfficeDestination(office);
            }
        } else {
            setAutocompleteValue(null);
            setFound(true);
            handleStateChange('destinationBranch', null, null);
            setContacts([]);
            setOfficeDestination(null);
        }
    };

    const officeOptions = useMemo(() => {
        return tranformOffices(offices);
    }, [offices]);


    return(
        <>
            {
                values && (
                    <>
                    <form onSubmit={handleFormSubmit} className="row">
                        <div className='row pt-3'>
                            <div className='col-6'>
                                <SelectDetailsForm<OptionType> 
                                    label='Select Origin Office:'
                                    initialData={{
                                        value: state.originBranch.office.id,
                                        label: state.originBranch.office.name
                                    }}
                                    listOptions={[]}
                                    transformData={() => {}}
                                    isMulti={false}
                                    isDisabled={true}
                                    />
                            </div>
                            <div className='col-6'>
                                <SelectDetailsForm<BranchOptionType>
                                    label='Select Origin Branche:'
                                    initialData={{
                                        value: state.originBranch.id,
                                        label: `${state.originBranch.city}\n${state.originBranch.address}`,
                                        address: state.originBranch.address,
                                        office: state.originBranch.office
                                    }}
                                    listOptions={branchesOrigin.map(branch => ({
                                        value: branch.id,
                                        label: `${branch.city}\n${branch.address}`,
                                        address: branch.address,
                                        office: { id: state.originBranch.office.id, name: state.originBranch.office.name }
                                    }))}
                                    transformData={(selected) => {
                                        const branch = {
                                            id: (selected as BranchOptionType).value,
                                            city: (selected as BranchOptionType).label.split('\n')[0],
                                            address: (selected as BranchOptionType).label.split('\n')[1],
                                            office: (selected as BranchOptionType).office
                                        };
                                        handleStateChange('originBranch', branch, branch);
                                    }}
                                    isMulti={false}
                                    isDisabled={!isClient}
                                />
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div className="col-6">
                                <Autocomplete
                                    value={autocompleteValue}
                                    onInputChange={(event, value) => setQuery(value)}
                                    onChange={handleOfficeAutoComplete}
                                    options={officeOptions}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(option, value) => {
                                                if(option.value === 0) return true;
                                                return option.value === value.value;
                                    }}
                                    renderInput={(params) => (
                                                                
                                        <TextField
                                            {...params}
                                            label="Search for a destination office"
                                            placeholder="Search for a destination office"
                                            variant="outlined"
                                            fullWidth
                                            disabled={!isClient}
                                            />
                                        )}
                                />
                            </div>
                            <div className="col-6">
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker 
                                        label="Delivery Date"
                                        value={moment(state.deliveryDate, 'DD/MM/YYYY')}
                                        onChange={handleChange}
                                        minDate={moment()}
                                        format="DD/MM/YYYY"
                                        disabled={!isClient}
                                    />
                                    {
                                        values.deliveryDate.error?.map((error, index) => (
                                            <div key={index} className={`text-danger ${error === '' ? 'd-none' : ''}`}>{error}</div>
                                        ))
                                    }
                                </LocalizationProvider>
                            </div>
                        </div>
                        { officeDestination && (
                            <div className="row pt-3">
                                <div className="col-6">
                                    <SelectDetailsForm<BranchOptionType>
                                        label='Select Destination Branch:'
                                        initialData={{
                                            value: state?.destinationBranch?.id ?? 0,
                                            label: `${state?.destinationBranch?.city}\n${state?.destinationBranch?.address}` ?? '',
                                            address: state?.destinationBranch?.address ?? '',
                                            office: state?.destinationBranch?.office ?? { id: 0, name: '' }
                                        }}
                                        listOptions={officeDestination.branches.map(branch => ({ 
                                            value: (branch as Branch).id, 
                                            label: `${branch.city}\n${branch.address}`, 
                                            address: branch.address, 
                                            office: {id: officeDestination.id, name: officeDestination.name } 
                                        }))}
                                        transformData={(selected) => {
                                            const destinationBranch = {
                                                id: (selected as BranchOptionType).value,
                                                city: (selected as BranchOptionType).label.split('\n')[0],
                                                address: (selected as BranchOptionType).label.split('\n')[1],
                                                office: (selected as BranchOptionType).office
                                            };
                                            handleStateChange('destinationBranch', destinationBranch, destinationBranch);
                                            handleStateChange('contacts', [], []);
                                            setContacts([]);
                                        }}
                                        isMulti={false}
                                        isDisabled={isAdmin || !isClient}
                                    />                
                                </div>
                                <div className="col">
                                    {
                                        state.destinationBranch && state.destinationBranch.office && (
                                            <SelectDetailsForm<ContactOptionType, Contact>
                                                label='Select Contact:'
                                                initialData={state.contacts.map(contact => ({ 
                                                                            value: contact.id, 
                                                                            label: `${contact.name} ${contact.lastName}`, 
                                                                            phone: contact.phone, 
                                                                            office: contact.office, 
                                                                            branches: contact.branches
                                                }))}
                                                listOptions={null}
                                                formatLabel={(item: Contact) => ({
                                                    value: item.id,
                                                    label: `${item.name} ${item.lastName}`,
                                                    phone: item.phone,
                                                    office: item.office,
                                                    branches: item.branches
                                                })}
                                                transformData={(selected) => {
                                                    if(Array.isArray(selected)){
                                                        const isSelectAll = selected.some(option => option.value === 0);
                                                
                                                        const newContact = isSelectAll ? contacts : selected.map(option => {
                                                            const [ name, lastName ] = option.label.split(' ');
                                                            return { id: option.value, name, lastName, phone: option.phone, office: option.office, branches: option.branches };
                                                        });
                                            
                                                        handleStateChange('contacts', newContact, newContact);
                                                    }
                                                }}
                                                isMulti={true}
                                                isDisabled={!isClient}
                                                fetchItem={() => serviceRequest.getItem<Contact[]>(`${paths.courier.contacts}office/${state.destinationBranch?.office.id}/branch/${state.destinationBranch?.id}`)}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        )}
                        { (isClient && !found) && (
                            <>
                                <div className="row pt-3">
                                    <div className='col-6'>
                                        <ReusableInput
                                            inputProps={{
                                                label: 'Receiver Name',
                                                name: 'receiverName',
                                                type: 'text',
                                                value: state.receiverName,
                                                placeholder: 'Receiver Full Name'
                                            }}
                                            onChange={handleChange}
                                            onFocus={onFocus}
                                            errorsMessage={values.receiverName.error}
                                        />    
                                    </div>
                                    <div className='col-6'>
                                        <ReusableInput
                                            inputProps={{
                                                label: 'Receiver Phone',
                                                name: 'receiverPhone',
                                                type: 'text',
                                                value: state.receiverPhone,
                                                placeholder: 'Receiver Phone'
                                            }}
                                            onChange={handleChange}
                                            onFocus={onFocus}
                                            errorsMessage={values.receiverPhone.error}
                                        />
                                    </div>
                                </div>
                                <div className="row pt-3">
                                    <div className="col">
                                        <ReusableInput
                                            inputProps={{
                                                label: 'Destination Address',
                                                name: 'destinationAddress',
                                                type: 'text',
                                                value: state.destinationAddress,
                                                placeholder: 'Destination Address'
                                            }}
                                            onChange={handleChange}
                                            onFocus={onFocus}
                                            errorsMessage={values.destinationAddress.error}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {
                            !isClient && (
                                <div className="row pt-3">
                                    <div className="col-6">
                                        <SelectDetailsForm<OptionType, StatusOrder>
                                            label='Select Status Order:'
                                            initialData={{ value: state.currentStatus.id, label: state.currentStatus.name }}
                                            listOptions={null}
                                            formatLabel={(item: StatusOrder) => ({
                                                value: item.id,
                                                label: `${item.name}`
                                            })}
                                            transformData={(selected) => {
                                                const currentStatus = {
                                                    id: (selected as StatusOrder).id,
                                                    name: (selected as StatusOrder).name,
                                                    description: (selected as StatusOrder).description
                                                };
                                                handleStateChange('currentStatus', currentStatus, currentStatus);
                                            }}
                                            isMulti={false}
                                            isDisabled={false}
                                            fetchItem={() => serviceRequest.getItem<StatusOrder[]>(`${paths.courier.statusOrder}all`)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <SelectDetailsForm<OptionType, User>
                                            label='Select Courier:'
                                            initialData={state.couriers.map(courier => ({ 
                                                                value: courier.id, 
                                                                label: `${courier.name} ${courier.lastName}` 
                                            }))}
                                            listOptions={null}
                                            formatLabel={(item: User) => ({
                                                value: item.id,
                                                label: `${item.name} ${item.lastName}`
                                            })}
                                            transformData={(selected) => {
                                                if(selected && Array.isArray(selected)){
                                                    const couriers = selected.map((courier: User) => ({
                                                        id: courier.id,
                                                        name: courier.name,
                                                        lastName: courier.lastName,
                                                        email: courier.email,
                                                        phone: courier.phone,
                                                        roles: courier.roles,
                                                        isActive: courier.isActive
                                                    }));
                                                    handleStateChange('couriers', couriers, couriers);
                                                }
                                            }}
                                            isMulti={true}
                                            isDisabled={!isAdmin}
                                            fetchItem={() => serviceRequest.getItem<User[]>(`${paths.courier.users}role/2`)}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        <div className="row">
                            <div className='col pt-3 text-center'>
                                <button className='btn btn-primary' type='submit'>Save</button>
                                { onClose && (<button className='btn btn-secondary ms-2' onClick={onClose}>Cancel</button>) }
                            </div>
                        </div>
                    </form>
                    </>
                )
            }
        </>
    );
}