import { useCallback, useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { useErrorBoundary } from "react-error-boundary";

import { Branch, BranchOptionType, Contact, FetchResponse, FormState, OfficeResponse, OptionType } from "@/domain";
import { useAsync, useFetchAndLoad, useForm } from "@/hooks";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";


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

export const useContactForm = (contactId: number | null) => {

    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ contact, setContact ] = useState<Contact | null>(null);

    const [ formData, setFormData ] = useState<Contact>({
        id: contact?.id || 0,
        name: contact?.name || '',
        lastName: contact?.lastName || '',
        phone: contact?.phone || '',
        office: contact?.office || { id: 0, name: '' },
        branches: contact?.branches || []
    });

    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);
    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);

    const [ initialState, setInitialState ] = useState<FormState>({
        name: {
            value: formData.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        lastName: {
            value: formData.lastName,
            validation: [
                validatorForm.validateNotEmpty
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

    const [ errorOfficeSelected, setErrorOfficeSelected ] = useState<string>('');

    const [ errorBranchSelected, setErrorBranchSelected ] = useState<string>('');

    const fetchContactDetails = async() => {
        if(!contactId) return Promise.resolve({ data: null, error: null });

        return await callEndPoint(serviceRequest.getItem<Contact>(`${paths.courier.contacts}id/${contactId}`));
    }

    const handleContactDetailsSuccess = (response: FetchResponse<Contact>) => {
        if(contactId){
            if(response.data) setContact(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchContactDetails, handleContactDetailsSuccess, () => {}, [contactId])

    useEffect(() => {
        if(contact){
            setFormData({
                id: contact.id,
                name: contact.name,
                lastName: contact.lastName,
                phone: contact.phone,
                office: contact.office,
                branches: contact.branches
            });

            setInitialState({
                name: {
                    value: contact.name,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                },
                lastName: {
                    value: contact.lastName,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                },
                phone: {
                    value: contact.phone,
                    validation: [
                        validatorForm.validateNotEmpty,
                        validatorForm.isCellularNumber
                    ],
                    validateRealTime: false
                }
            });

            setValues({
                name: {
                    value: contact.name,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                },
                lastName: {
                    value: contact.lastName,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                },
                phone: {
                    value: contact.phone,
                    validation: [
                        validatorForm.validateNotEmpty,
                        validatorForm.isCellularNumber
                    ],
                    validateRealTime: false
                }
            });
        }
    }, [contact]);

    useEffect(() => {
        if(values){
            setFormData((prev) => ({
                ...prev,
                name: values.name.value,
                lastName: values.lastName.value,
                phone: values.phone.value
            }));
        }
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as Contact);
        }
    }, [formData.id]);

    const handleSubmit = () => {
        
        const isValidForm = validateForm();
        const isOfficeValid = formData.office.id !== 0;
        const isBranchValid = formData.branches.length > 0;

        setErrorOfficeSelected(isOfficeValid ? '' : 'Please select an office');
        setErrorBranchSelected(isBranchValid ? '' : 'Please select at least one branch');

        
        return isValidForm && isOfficeValid && isBranchValid ? formData : null;
    }

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

    const fetchOffices = async() => await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}all`));

    const handleOfficesSuccess = (response: FetchResponse<OfficeResponse[]>) => {
        if(response.data){
            setOffices(response.data);
        }
        else showBoundary(response.error);
    }

    useAsync(fetchOffices, handleOfficesSuccess, () => {}, []);

    useEffect(() => {
        if(contact && offices.length > 0){
            const office = offices.find(office => office.id === contact.office.id);
            setSelectedOffice({
                id: contact.office.id,
                name: contact.office.name,
                branches: office ? office.branches : []
            });
        }
    }, [contact, offices]);

    return {
        formData,
        values,
        handleSubmit,
        handleOfficeChange,
        handleBranchChange,
        handleChange,
        onFocus,
        errorOfficeSelected,
        errorBranchSelected,
        loading,
        offices,
        selectedOffice
    }
}