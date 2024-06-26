import { useCallback, useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { useErrorBoundary } from "react-error-boundary";

import { useAsync, useFetchAndLoad, useForm } from "@/hooks";
import { BranchResponse, FetchResponse, FormState, OfficeResponse, OptionType } from "@/types";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";
import { ReusableInput, ReusableSelect } from "@/components/shared";

interface BranchFormProps {
    branchId?: number | null;
    onSubmit: (branch: BranchResponse) => void;
}

const tranformOffices = (offices: OfficeResponse[]): OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

export const BranchForm = ({ branchId, onSubmit }: BranchFormProps) => {

    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ branch, setBranch ] = useState<BranchResponse | null>(null);

    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);

    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);

    const [ errorOfficeSelected, setErrorOfficeSelected ] = useState<string>('');

    const [ isValidatedForm, setIsValidatedForm ] = useState<boolean | null>(null);

    const [ formData, setFormData ] = useState<BranchResponse>({
        id: branch?.id || 0,
        city: branch?.city || '',
        address: branch?.address || '',
        office: branch?.office || { id: 0, name: ''}
    });

    const [ initialState, setInitialState ] = useState<FormState>({
        city: {
            value: formData.city,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        address: {
            value: formData.address,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        }
    });

    const { values, handleChange, onFocus, validateForm, setValues } = useForm(initialState);

    const fetchBranchDetails = async() => {
        if(!branchId) return Promise.resolve({ data: null, error: null });

        return await callEndPoint(serviceRequest.getItem<BranchResponse>(`${paths.courier.branches}id/${branchId}`));
    }

    const handleBranchDetailsSuccess = (response: FetchResponse<BranchResponse>) => {
        if(branchId){
            if(response.data) setBranch(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchBranchDetails, handleBranchDetailsSuccess, () => {}, [branchId]);

    useEffect(() => {
        if(branch && !selectedOffice){
            setFormData({
                id: branch.id,
                city: branch.city,
                address: branch.address,
                office: branch.office
            });

            setInitialState({
                city: {
                    value: branch.city,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                },
                address: {
                    value: branch.address,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                }
            });

            setValues({
                city: {
                    value: branch.city,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                },
                address: {
                    value: branch.address,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                }
            })
        }
    }, [branch, selectedOffice]);

    useEffect(() => {
        if(values){
            setFormData((prev) => ({
                ...prev,
                city: values.city.value,
                address: values.address.value
            }));
        }
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as BranchResponse);
        }
    }, [formData.id]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        console.log(formData);
        setIsValidatedForm(validateForm());
    }

    useEffect(() => {
        if(isValidatedForm !== null){
            formData.office.id === 0 ? setErrorOfficeSelected('This field is required.') : setErrorOfficeSelected('');
        }
    }, [formData.office.id, isValidatedForm]);

    useEffect(() => {
        if(isValidatedForm && errorOfficeSelected === ''){
            onSubmit(formData);
        }
    }, [isValidatedForm]);

    const handleOfficeChange = useCallback((selected: MultiValue<OptionType> | SingleValue<OptionType>) => {
        if(!selected || Array.isArray(selected)) return;

        const office = offices.find(office => office.id === (selected as OptionType).value) || null;
        setSelectedOffice(office);
        setFormData({
            ...formData,
            office: office ? { id: office.id, name: office.name } : { id: 0, name: '' },
        });
    }, [offices, formData]);

    const fetchOffices = async() => await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}all`));

    const handleOfficesSuccess = (response: FetchResponse<OfficeResponse[]>) => {
        if(response.data) setOffices(response.data);
        else showBoundary(response.error);
    }

    useAsync(fetchOffices, handleOfficesSuccess, () => {}, []);

    return(
        <>
            {
                (!loading && values) && (
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-6">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'City',
                                        name: 'city',
                                        type: 'text',
                                        value: values.city.value,
                                        placeholder: 'Enter city name'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.city.error}
                                />
                            </div>
                            <div className="col-6">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'Address',
                                        name: 'address',
                                        type: 'text',
                                        value: values.address.value,
                                        placeholder: 'Enter address'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.address.error}
                                />
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div className="col-12">
                                <ReusableSelect<OptionType> 
                                    label='Select Office:'
                                    value={formData.office ? { value: formData.office.id, label: formData.office.name } : null}
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
                        <div className="row">
                            <div className="col pt-3 text-center">
                                <button className="btn btn-primary" type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                )
            }
        </>
    )
}