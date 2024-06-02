import { useCallback, useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { useErrorBoundary } from "react-error-boundary";

import { Branch, BranchOptionType, Contact, FetchResponse, FormState, OfficeResponse, OptionType } from "@/types";
import { useAsync, useFetchAndLoad, useForm } from "@/hooks";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";
import { ReusableInput, ReusableSelect } from "@/components/shared";

interface ContactFormProps {
    contactId: number | null;
    onSubmit: (contact: Contact) => void;
}

const tranformOffices = (offices: OfficeResponse[]): OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

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

export const ContactForm = ({ contactId, onSubmit }: ContactFormProps) => {

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

    const [ isValidatedForm, setIsValidatedForm ] = useState<boolean | null>(null);

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

            setSelectedOffice({
                id: contact.office.id,
                name: contact.office.name,
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
        setFormData((prev) => ({
            ...prev,
            name: values.name.value,
            lastName: values.lastName.value,
            phone: values.phone.value
        }));
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as Contact);
        }
    }, [formData.id]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsValidatedForm(validateForm() && formData.office.id !== 0 && formData.branches.length > 0);
    }

    useEffect(() => {
        if(isValidatedForm){
            console.log(formData);
            onSubmit(formData);
        }else if(isValidatedForm !== null){
            formData.office.id === 0 ? setErrorOfficeSelected('This field is required.') : setErrorOfficeSelected('');
            !formData.branches.length ? setErrorBranchSelected('This field is required.') : setErrorBranchSelected('');
        }
    }, [isValidatedForm, formData.office.id, formData.branches]);

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
        if(response.data) setOffices(response.data);
        else showBoundary(response.error);
    }

    useAsync(fetchOffices, handleOfficesSuccess, () => {}, []);

    return(
        <>
            {
                !loading && (
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
                            <div className='col'>
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
                        {
                            errorOfficeSelected !== '' && (
                                <div className="row">
                                    <div className="col text-danger">{errorOfficeSelected}</div>
                                </div>
                            )
                        }
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
                        {
                            errorBranchSelected !== '' && (
                                <div className="row">
                                    <div className="col text-danger">{errorBranchSelected}</div>
                                </div>
                            )
                        }
                        <div className="row">
                            <div className='col pt-3 text-center'>
                                <button className='btn btn-primary' type='submit'>Save</button>
                            </div>
                        </div>
                    </form>
                )
            }
        </>
    )
}