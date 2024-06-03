import { paths } from "@/helpers";
import { useAsync, useAuth, useFetchAndLoad } from "@/hooks";
import { serviceRequest } from "@/services";
import { Branch, BranchOptionType, Client, Contact, ContactOptionType, FetchResponse, FormState, Office, OfficeResponse, OptionType, Order } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { MultiValue, SingleValue } from "react-select";
import { ReusableSelect } from "../shared";
import { Autocomplete, TextField } from "@mui/material";

interface OrderFormProps {
    orderId: number | null;
    onSubmit: (order: Order) => void;
}

const tranformOffices = (offices: OfficeResponse[]): readonly OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

const transformOptionsToBranches = (options: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>): Branch => {
    if(options){
        const [ city, address ] = (options as BranchOptionType).label.split('\n');
        return { id: (options as BranchOptionType).value, city, address };
    }
        
    return { id: 0, city: '', address: '' };
    
}

const transformOptionsToContacts = (options: MultiValue<ContactOptionType> | SingleValue<ContactOptionType>): Contact[] => {
    if(Array.isArray(options)){
        return options.map(option => {
            const [ name, lastName ] = option.label.split(' ');
            return { id: option.value, name, lastName, phone: option.phone, office: option.office, branches: option.branches };
        });
    }
    if(options){
        const [ name, lastName ] = (options as ContactOptionType).label.split(' ');
        return [{ id: (options as ContactOptionType).value, name, lastName, phone: (options as ContactOptionType).phone, office: (options as ContactOptionType).office, branches: (options as ContactOptionType).branches }];
    }
    
    return [];
}


export const OrderForm = ({ orderId, onSubmit }: OrderFormProps) => {

    const { userDetails } = useAuth();
    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ client, setClient ] = useState<Client | null>(null);

    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);
    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);
    const [ branches, setBranches ] = useState<Branch[]>([]);
    const [ selectedBranch, setSelectedBranch ] = useState<Branch | null>(null);
    const [ selectedBranchDestination, setSelectedBranchDestination ] = useState<Branch | null>(null);

    const [ contacts, setContacts ] = useState<Contact[] | null>(null);

    const [ query, setQuery ] = useState<string>('');

    const [ formData, setFormData ] = useState<Order>({
        id: orderId || 0,
        client: client,
        originOffice: null,
        originBranch: selectedBranch,
        destinationOffice: null,
        destinationBranch: null,
        contacts: null,
        couriers: null,
        deliveryDate: '',
        receiverName: null,
        receiverPhone: null,
        destinationAddress: null,
        currentStatus: null,
        statusHistory: null
    });

    const [ initialState, setInitialState ] = useState<FormState>({

    });

    const fetchClientDetails = async() => {
        if(userDetails && userDetails.id){
            return await callEndPoint(serviceRequest.getItem<Client>(`${paths.courier.users}id/${userDetails.id}`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleClientDetailsSuccess = (response: FetchResponse<Client>) => {
        if(userDetails && userDetails.id){
            if(response.data) setClient(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchClientDetails, handleClientDetailsSuccess, () => {}, [userDetails]);

    useEffect(() => {
        if(client && !branches.length){
            
            setBranches(client.branches);
            setSelectedBranch(client.branches[0]);
            setFormData({
                ...formData,
                client: client,
                originOffice: client.office,
                originBranch: client.branches[0]
            });
        }
    }, [client]);

    const handleOfficeAutoComplete = (event: React.SyntheticEvent<Element, Event>, value: OptionType | null) => {
        if(value){
            const office = offices.find(office => office.id === value.value);
            if(office){
                setSelectedOffice(office);
                setFormData({
                    ...formData,
                    destinationOffice: {
                        id: office.id,
                        name: office.name
                    }
                });
            }
        }
    }

    const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
        setQuery(value);
    }


    const handleBranchChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        setSelectedBranch(transformOptionsToBranches(selected));
        setFormData({
            ...formData,
            originBranch: transformOptionsToBranches(selected)
        });
    }, [formData]);


    const handleBranchDestinationChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        setSelectedBranchDestination(transformOptionsToBranches(selected));
        setFormData({
            ...formData,
            destinationBranch: transformOptionsToBranches(selected)
        });
    }, [formData]);

    const handleContactChange = useCallback((selected: MultiValue<ContactOptionType> | SingleValue<ContactOptionType>) => {
        if(!selected) return;

        setFormData({
            ...formData,
            contacts: transformOptionsToContacts(selected)
        });
    }, [formData]);

    const searchContacts = async(): Promise<FetchResponse<Contact[]>> => {
        if(formData.destinationOffice?.id && formData.destinationBranch?.id){
            return await callEndPoint(serviceRequest.getItem<Contact[]>(`${paths.courier.contacts}office/${formData.destinationOffice.id}/branch/${formData.destinationBranch.id}`));
        }
        return { data: null, error: null };
    }

    const searchContactsSuccess = (response: FetchResponse<Contact[]>) => {
        if(formData.destinationOffice?.id && formData.destinationBranch?.id){
            if(response.data) setContacts(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(searchContacts, searchContactsSuccess, () => {}, [formData.destinationOffice?.id, formData.destinationBranch?.id]);

    const searchOffice = async(): Promise<FetchResponse<OfficeResponse[]>> => {
        if(query){
            return await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}search/name?query=${query}`));
        }
        return { data: null, error: null };
    }

    const handleSearchSuccess = (response: FetchResponse<OfficeResponse[]>) => {
        if(query){
            if(response.data) setOffices(response.data);
            else showBoundary(response.error);
        }else setOffices([]);
    }

    useAsync(searchOffice, handleSearchSuccess, () => {}, [query]);

    

    useEffect(() => {
        console.log(formData);
    }, [formData]);
    

    return(
        <>
            {
                (client && branches.length > 0) && (
                    <>
                        <form className="row g-4 pt-3">
                            <div className='row'>
                                <div className='col-6'>
                                        <ReusableSelect<OptionType> 
                                            label='Select Office:'
                                            value={formData.originOffice ? { value: formData.originOffice.id, label: formData.originOffice.name }: null }
                                            options={[]}
                                            onChange={() => {}}
                                            isMulti={false}
                                            isDisabled={true}
                                        />
                                </div>
                                <div className='col-6'>
                                        <ReusableSelect<BranchOptionType>
                                            label='Select Branches:'
                                            value={formData.originBranch ? { value: formData.originBranch.id, label: `${formData.originBranch.city}\n${formData.originBranch.address}`, address: formData.originBranch.address } : null}
                                            options={branches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address }))}
                                            onChange={handleBranchChange}
                                            isMulti={false}
                                        />
                                </div>
                            </div>
                            <div className="row pt-3">
                                <div className="col">
                                    <Autocomplete
                                        onInputChange={handleInputChange}
                                        onChange={handleOfficeAutoComplete}
                                        options={tranformOffices(offices)}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search for an office"
                                                placeholder="Search for an office"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="row pt-3">
                                <div className="col">
                                    <ReusableSelect<BranchOptionType>
                                        label='Select Destination Branch:'
                                        value={selectedBranchDestination ? { value: selectedBranchDestination.id, label: `${selectedBranchDestination.city}\n${selectedBranchDestination.address}`, address: selectedBranchDestination.address } : null}
                                        options={selectedOffice ? selectedOffice.branches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address })) : []}
                                        onChange={handleBranchDestinationChange}
                                        isMulti={false}
                                    />
                                </div>
                            </div>
                            <div className="row pt-3">
                                <div className="col">
                                    <ReusableSelect<ContactOptionType>
                                        label='Select Contact:'
                                        value={formData.contacts ? formData.contacts.map(contact => ({ value: contact.id, label: `${contact.name} ${contact.lastName}`, phone: contact.phone, office: contact.office, branches: contact.branches})) : []}
                                        options={contacts ? contacts.map(contact => ({ value: contact.id, label: `${contact.name} ${contact.lastName}`, phone: contact.phone, office: contact.office, branches: contact.branches})) : []}
                                        onChange={handleContactChange}
                                        isMulti
                                    />
                                </div>
                            </div>
                        </form>
                    </>
                )
            }
        </>
    )
}