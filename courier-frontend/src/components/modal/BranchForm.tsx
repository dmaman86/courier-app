import { useCallback, useEffect, useState } from "react";
import { useFetchAndLoad, useForm } from "../../hooks";
import { BranchResponse, FetchResponse, FormState, OfficeResponse, OptionType } from "../../types";
import { paths, validatorForm } from "../../helpers";
import { serviceRequest } from "../../services";
import { MultiValue, SingleValue } from "react-select";
import { ReusableInput, ReusableSelect } from "../shared";

interface BranchFormProps {
    branchId: number | null;
    onSubmit: (branch: BranchResponse) => void;
}

const tranformOffices = (offices: OfficeResponse[]): OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

export const BranchForm = ({ branchId, onSubmit }: BranchFormProps) => {

    const { loading, callEndPoint } = useFetchAndLoad();

    const [ branch, setBranch ] = useState<BranchResponse | null>(null);

    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);

    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);

    const [ responseBranch, setResponseBranch ] = useState<FetchResponse<BranchResponse>>({
        data: null, error: null
    });

    const [ responseOffices, setResponseOffices ] = useState<FetchResponse<OfficeResponse[]>>({
        data: null, error: null
    });

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

    useEffect(() => {
        if(branchId !== null && !responseBranch.data && !responseBranch.error){
            const fetchBranchDetails = async () => {
                const response = await callEndPoint(serviceRequest.getItem<BranchResponse>(`${paths.courier.branches}id/${branchId}`));
                setResponseBranch(response);
            };
            fetchBranchDetails();
        }
    }, [branchId, callEndPoint, responseBranch]);

    useEffect(() => {
        if(!loading && responseBranch.data && !responseBranch.error && !branch){
            setBranch(responseBranch.data);
        }
    }, [loading, responseBranch, branch]);

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
        setFormData((prev) => ({
            ...prev,
            city: values.city.value,
            address: values.address.value
        }));
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

    const fetchOffices = useCallback(async () => {
        const response = await callEndPoint(serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}all`));
        setResponseOffices(response);
    }, [callEndPoint]);

    useEffect(() => {
        if(!offices.length && !responseOffices.data && !responseOffices.error)
            fetchOffices();
    }, [offices, responseOffices, fetchOffices]);

    useEffect(() => {
        if(!loading && responseOffices.data && !responseOffices.error){
            setOffices(responseOffices.data);
            setResponseOffices({ data: null, error: null });
        }
    }, [loading, responseOffices]);



    return(
        <>
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
        </>
    )
}