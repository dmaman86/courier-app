import React, { useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { MultiValue, SingleValue } from "react-select";
import { Autocomplete, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";

import { paths, validatorForm } from "@/helpers";
import { useAsync, useAuth, useFetchAndLoad, useForm } from "@/hooks";
import { serviceRequest } from "@/services";
import { Branch, BranchResponse, Client, Contact, ContactOptionType, FetchResponse, FormState, Office, OfficeResponse, OptionType, Order, StatusOrder, User } from "@/types";
import { ReusableInput, ReusableSelect } from "../shared";
import { set } from "lodash";


interface OrderFormProps {
    orderId: number | null;
    onSubmit: (order: Order) => void;
}

interface BranchOptionType extends OptionType {
    address: string;
    office: Office;
}

const tranformOffices = (offices: OfficeResponse[]): readonly OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

const transformOptionsToBranches = (options: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>): BranchResponse => {
    if(options){
        const [ city, address ] = (options as BranchOptionType).label.split('\n');
        return { id: (options as BranchOptionType).value, city, address, office: (options as BranchOptionType).office};
    }
        
    return { id: 0, city: '', address: '', office: { id: 0, name: '' }};
    
}

const transformOptionsToContacts = (options: MultiValue<ContactOptionType> | SingleValue<ContactOptionType>): Contact[] => {
    if(Array.isArray(options)){
        return options.map(option => {
            const [ name, lastName ] = option.label.split(' ');
            return { id: option.value, name, lastName, phone: option.phone, office: option.office, branches: option.branches };
        });
    }
    
    return [];
}


export const OrderForm = ({ orderId, onSubmit }: OrderFormProps) => {

    const { userDetails } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ isClient, setIsClient ] = useState<boolean>(false);
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const [ client, setClient ] = useState<Client | null>(null);

    const [ offices, setOffices ] = useState<OfficeResponse[]>([{ id: 0, name: 'Not Found', branches: [] }]);
    const [ officeDestination, setOfficeDestination ] = useState<OfficeResponse | null>(null);

    const [ branchesOrigin, setBranchesOrigin ] = useState<Branch[]>([]);
    const [ selectedBranchOrigin, setSelectedBranchOrigin ] = useState<BranchResponse | null>(null);
    const [ selectedBranchDestination, setSelectedBranchDestination ] = useState<BranchResponse | null>(null);

    const [ contacts, setContacts ] = useState<Contact[]>([]);

    const [ query, setQuery ] = useState<string>('');
    const [ found, setFound ] = useState<boolean>(true);

    const [ order, setOrder ] = useState<Order | null>(null);

    const [ initialState, setInitialState ] = useState<FormState | null>(null);

    const { values, handleChange, onFocus, validateForm, setValues, handleDateChange, updateValues } = useForm(initialState);

    const [ isValidForm, setIsValidForm ] = useState<boolean>(false);

    const [autocompleteValue, setAutocompleteValue] = useState<OptionType | null>(null);

    const [ statusOrderList, setStatusOrderList ] = useState<StatusOrder[]>([]);
    const [ selectedStatusOrder, setSelectedStatusOrder ] = useState<StatusOrder | null>(null);
    const [ couriersList, setCouriersList ] = useState<User[]>([]);
    const [ selectedCourier, setSelectedCourier ] = useState<User[]>([]);

    const updateInitialState = useCallback((order: Order) => {
        setInitialState({
            deliveryDate: {
                value: order.deliveryDate,
                validation: [validatorForm.isDate, validatorForm.isSelectedDateValid],
                validateRealTime: false
            },
            receiverName: {
                value: order.receiverName,
                validation: [validatorForm.validateNotEmpty],
                validateRealTime: false
            },
            receiverPhone: {
                value: order.receiverPhone,
                validation: [validatorForm.validateNotEmpty, validatorForm.isCellularNumber],
                validateRealTime: false
            },
            destinationAddress: {
                value: order.destinationAddress,
                validation: [validatorForm.validateNotEmpty],
                validateRealTime: false
            }
        });
    }, []);

    useEffect(() => {
        if (!orderId && !order && userDetails && client) {
            setOrder({
                id: 0,
                client: userDetails,
                originBranch: {
                    id: client.branches[0].id,
                    city: client.branches[0].city,
                    address: client.branches[0].address,
                    office: client.office
                },
                destinationBranch: selectedBranchDestination,
                contacts: contacts || [],
                deliveryDate: moment().format('DD/MM/YYYY'),
                receiverName: '',
                receiverPhone: '',
                destinationAddress: '',
                couriers: selectedCourier,
                currentStatus: selectedStatusOrder,
            });
            setBranchesOrigin(client.branches);
            setSelectedBranchOrigin({
                id: client.branches[0].id,
                city: client.branches[0].city,
                address: client.branches[0].address,
                office: client.office
            });
        }else if(order && order.id === 0){
            const { id, ...rest } = order;
            setOrder(rest as Order);
        }
    }, [orderId, order, userDetails, client]);

    useEffect(() => {
        if (order && !initialState) {
            console.log(order);
            updateInitialState(order);
        }
    }, [order, initialState, updateInitialState]);

    useEffect(() => {
        if (initialState) {
            updateValues(initialState);
        }
    }, [initialState, updateValues]);

    useEffect(() => {
        if (values && order) {
            const updatedOrder = {
                ...order,
                receiverName: values.receiverName.value,
                receiverPhone: values.receiverPhone.value,
                destinationAddress: values.destinationAddress.value,
                deliveryDate: values.deliveryDate.value,
                currentStatus: selectedStatusOrder,
                couriers: selectedCourier
            };
            setOrder(updatedOrder);
        }
    }, [values, order]);

    const fetchOrderDetails = async() => {
        if(orderId && !order){
            return await callEndPoint(serviceRequest.getItem<Order>(`${paths.courier.orders}${orderId}`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleGetOrderDetails = (response: FetchResponse<Order>) => {
        if(orderId && !order){
            if(response.data){
                setOrder(response.data);
                setSelectedStatusOrder(response.data.currentStatus);
                setSelectedCourier(response.data.couriers);
                if(response.data.destinationBranch && response.data.destinationBranch.office){
                    setAutocompleteValue({
                        value: response.data.destinationBranch.office.id,
                        label: response.data.destinationBranch.office.name
                    });
                }
                
            }
            else showBoundary(response.error);
        }
    }

    useAsync(fetchOrderDetails, handleGetOrderDetails, () => {}, [orderId]);

    useEffect(() => {
        if(userDetails){
            setIsClient(userDetails.roles.some(role => role.name === 'ROLE_CLIENT'));
            setIsAdmin(userDetails.roles.some(role => role.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    const fetchClientDetails = async() => {
        if(userDetails && userDetails.id && isClient){
            return await callEndPoint(serviceRequest.getItem<Client>(`${paths.courier.users}id/${userDetails.id}`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleClientDetailsSuccess = (response: FetchResponse<Client>) => {
        if(userDetails && userDetails.id && isClient){
            if(response.data) setClient(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchClientDetails, handleClientDetailsSuccess, () => {}, [userDetails, isClient]);

    const fetchStatusOrders = async() => {
        if(!isClient && !statusOrderList.length)
            return await callEndPoint(serviceRequest.getItem<StatusOrder[]>(`${paths.courier.statusOrder}all`));
        return { data: null, error: null };
    }

    const handleStatusOrdersSuccess = (response: FetchResponse<StatusOrder[]>) => {
        if(!isClient && !statusOrderList.length){
            if(response.data) setStatusOrderList(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchStatusOrders, handleStatusOrdersSuccess, () => {}, [isClient, statusOrderList]);

    const fetchCouriers = async() => {
        if(isAdmin && !couriersList.length)
            return await callEndPoint(serviceRequest.getItem<User[]>(`${paths.courier.users}role/2`));
        return { data: null, error: null };
    }

    const handleCouriersSuccess = (response: FetchResponse<User[]>) => {
        if(isAdmin && !couriersList.length){
            if(response.data) setCouriersList(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchCouriers, handleCouriersSuccess, () => {}, [isAdmin, couriersList]);

    useEffect(() => {
        if(!isClient){
            if(statusOrderList.length > 0) console.log(statusOrderList);
        }
        if(isAdmin && couriersList.length > 0){
            console.log(couriersList);
        }
    }, [isClient, statusOrderList, couriersList, isAdmin]);

    const handleOfficeAutoComplete = (event: React.SyntheticEvent<Element, Event>, value: OptionType | null) => {
        
        if(value){
            setAutocompleteValue(value);
            if(value.value === 0){
                setFound(false);
                setSelectedBranchDestination(null);
                setContacts([]);
                setOfficeDestination(null);
            }else{
                setFound(true);
                const office = offices.find(office => office.id === value.value);
                office && setOfficeDestination(office);
            }
        }else{
            setFound(true);
            setSelectedBranchDestination(null);
            setContacts([]);
            setOfficeDestination(null);
        }
    }

    useEffect(() => {
        if(officeDestination){
            if(order && !order.destinationBranch){
                setOrder({
                    ...order,
                    destinationBranch: {
                        id: (officeDestination.branches[0] as Branch).id,
                        city: (officeDestination.branches[0] as Branch).city,
                        address: (officeDestination.branches[0] as Branch).address,
                        office: {
                            id: officeDestination.id,
                            name: officeDestination.name
                        }
                    },
                    contacts: []
                });
            }
        }
    }, [officeDestination, order]);

    const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
        setQuery(value);
    }


    const handleBranchChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        // setSelectedBranch(transformOptionsToBranches(selected));
        if(order){
            setOrder({
                ...order,
                originBranch: transformOptionsToBranches(selected)
            });
        }
    }, [order]);


    const handleBranchDestinationChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(!selected || Array.isArray(selected)) return;
        console.log(selected);
        if(order){
            setContacts([]);
            setOrder({
                ...order,
                destinationBranch: transformOptionsToBranches(selected),
                contacts: []
            });
        }
    }, [order]);

    const handleContactChange = useCallback((selected: MultiValue<ContactOptionType> | SingleValue<ContactOptionType>) => {
        if(!selected) return;

        if(Array.isArray(selected)){
            const selectedAll = selected.find(option => option.value === 0);
            const newContacts: Contact[] = (selectedAll && contacts) ? contacts : transformOptionsToContacts(selected);
            
            if(order){
                setOrder({
                    ...order,
                    contacts: newContacts
                });
            }
            
        }
    }, [order]);

    const handleStatusChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        const status = statusOrderList.find(status => status.id === (selected as OptionType).value);
        if(status && order){
            setSelectedStatusOrder(status);
            setOrder({
                ...order,
                currentStatus: status
            });
        }

    }, [order]);

    const handleCouriersChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if (Array.isArray(selected) && couriersList.length > 0) {
            /*const couriers = selected
                .map(option => couriersList.find(courier => courier?.id === option.value))
                .filter(courier => courier !== undefined) as User[];*/
            const couriers = couriersList.filter(courier => selected.some(option => option.value === courier.id));
            
            if (order) {
                setSelectedCourier(couriers);
                setOrder({
                    ...order,
                    couriers
                });
            }
        }
    }, [order, couriersList]);

    const searchContacts = async(): Promise<FetchResponse<Contact[]>> => {
        if(order && order.destinationBranch){
            const { destinationBranch } = order;
            return await callEndPoint(serviceRequest.getItem<Contact[]>(`${paths.courier.contacts}office/${destinationBranch.office.id}/branch/${destinationBranch.id}`));
        }
        return { data: null, error: null };
    }

    const searchContactsSuccess = (response: FetchResponse<Contact[]>) => {
        if(order && order.destinationBranch){
            if(response.data){
                setContacts(response.data);
            }
            else showBoundary(response.error);
        }
    }

    useAsync(searchContacts, searchContactsSuccess, () => {}, [order?.destinationBranch?.id, order?.destinationBranch?.office.id]);

    const searchOffice = async(): Promise<FetchResponse<OfficeResponse[]>> => {
        if(query){
            return await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}search/name?query=${query}`));
        }
        return { data: null, error: null };
    }

    const handleSearchSuccess = (response: FetchResponse<OfficeResponse[]>) => {
        if(query){
            if(response.data) setOffices([...response.data, { id: 0, name: 'Not Found', branches: [] }]);
            else showBoundary(response.error);
        }else setOffices([{ id: 0, name: 'Not Found', branches: [] }]);
    }

    useAsync(searchOffice, handleSearchSuccess, () => {}, [query]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(order){
            if(isClient){
                const isValid = validateForm();
                const v2 = (!found) ? (order.originBranch !== null) : (order.originBranch !== null) && (order.destinationBranch !== null) && (order.contacts.length > 0);
                setIsValidForm(isValid && v2);
            }else{
                const v3 = (isAdmin) ? (order.currentStatus !== null) && (order.couriers.length > 0) : (order.currentStatus !== null);
                setIsValidForm(v3);
            }
        }

    }, [order, found, validateForm]);


    
    
    useEffect(() => {
        if (isValidForm && order) {
            console.log("Form is valid, submitting data:", order);
            setIsValidForm(false);
            onSubmit(order);
            // onSubmit((orderId && order) ? order : baseOrder as Order);
        }
    }, [isValidForm, onSubmit, order]);
    

    return(
        <>
            {
                (values && order) && (
                    <>
                        <form onSubmit={handleSubmit} className="row g-4 pt-3">
                            <div className='row'>
                                <div className='col-6'>
                                        <ReusableSelect<OptionType> 
                                            label='Select Origin Office:'
                                            value={order.originBranch?.office ? { value: order.originBranch.office.id, label: order.originBranch.office.name }: null }
                                            options={[]}
                                            onChange={() => {}}
                                            isMulti={false}
                                            isDisabled={true}
                                        />
                                </div>
                                <div className='col-6'>
                                        <ReusableSelect<BranchOptionType>
                                            label='Select Origin Branche:'
                                            value={order.originBranch ? { value: order.originBranch.id, label: `${order.originBranch.city}\n${order.originBranch.address}`, address: order.originBranch.address, office: { id: order.originBranch.office.id, name: order.originBranch.office.name } } : null}
                                            options={client ? branchesOrigin.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address, office: { id: client.office.id, name: client.office.name } })) : []}
                                            onChange={handleBranchChange}
                                            isMulti={false}
                                            isDisabled={!isClient}
                                        />
                                </div>
                            </div>
                            <div className="row pt-3">
                                <div className="col-6">
                                    <Autocomplete
                                        onInputChange={handleInputChange}
                                        onChange={handleOfficeAutoComplete}
                                        options={tranformOffices(offices)}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
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
                                            value={moment(values.deliveryDate.value, 'DD/MM/YYYY')}
                                            onChange={handleDateChange}
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
                            { found && (
                                <div className="row pt-3">
                                    <div className="col-6">
                                        <ReusableSelect<BranchOptionType>
                                            label='Select Destination Branch:'
                                            value={order.destinationBranch && order.destinationBranch.office ? { value: order.destinationBranch.id, label: `${order.destinationBranch.city}\n${order.destinationBranch.address}`, address: order.destinationBranch.address, office: order.destinationBranch.office } : null}
                                            options={officeDestination ? officeDestination.branches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address, office: {id: officeDestination.id, name: officeDestination.name } })) : []}
                                            onChange={handleBranchDestinationChange}
                                            isMulti={false}
                                            isDisabled={isAdmin || !isClient}
                                        />
                                    </div>
                                    <div className="col">
                                                <ReusableSelect<ContactOptionType>
                                                    label='Select Contact:'
                                                    value={order.contacts.map(contact => ({ value: contact.id, label: `${contact.name} ${contact.lastName}`, phone: contact.phone, office: contact.office, branches: contact.branches}))}
                                                    options={[ { value: 0, label: 'Select All', phone: '', office: {id: 0, name: ''}, branches: []}, ...(contacts ? contacts.map(contact => ({ value: contact.id, label: `${contact.name} ${contact.lastName}`, phone: contact.phone, office: contact.office, branches: contact.branches})) : [])]}
                                                    onChange={handleContactChange}
                                                    isMulti={true}
                                                    isDisabled={isClient && order.destinationBranch !== null ? false : true}
                                                />
                                            </div>
                                </div>
                            )}
                            { (isClient && !found && values.receiverName && values.receiverPhone && values.destinationAddress) && (
                                <>
                                    <div className="row pt-3">
                                        <div className='col-6'>
                                            <ReusableInput
                                                inputProps={{
                                                    label: 'Receiver Name',
                                                    name: 'receiverName',
                                                    type: 'text',
                                                    value: values.receiverName.value,
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
                                                    value: values.receiverPhone.value,
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
                                                    value: values.destinationAddress.value,
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
                                            <ReusableSelect<OptionType>
                                                label='Select Status Order:'
                                                value={order.currentStatus ? { value: order.currentStatus.id, label: order.currentStatus.name } : null}
                                                options={statusOrderList.map(statusOrder => ({ value: statusOrder.id, label: statusOrder.name }))}
                                                onChange={handleStatusChange}
                                                isMulti={false}
                                                isDisabled={false}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <ReusableSelect<OptionType>
                                                label='Select Courier:'
                                                value={order.couriers.length > 0 ? order.couriers.map(courier => ({ value: courier.id, label: `${courier.name} ${courier.lastName}` })) : null}
                                                options={couriersList.map(courier => ({ value: courier.id, label: `${courier.name} ${courier.lastName}` }))}
                                                onChange={handleCouriersChange}
                                                isMulti={true}
                                                isDisabled={!isAdmin}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            <div className="row">
                                <div className='col pt-3 text-center'>
                                    <button className='btn btn-primary' type='submit'>Save</button>
                                </div>
                            </div>
                        </form>
                    </>
                )
            }
        </>
    )
}