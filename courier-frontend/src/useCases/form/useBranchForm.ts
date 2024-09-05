import { useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { MultiValue, SingleValue } from "react-select";

import { paths, validatorForm } from "@/helpers";
import { useAsync, useFetchAndLoad, useForm } from "@/hooks";
import { serviceRequest } from "@/services";
import { BranchResponse, FetchResponse, FormState, OfficeResponse, OptionType } from "@/domain";


export const useBranchForm = (branchId: number | null) => {

    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ branch, setBranch ] = useState<BranchResponse | null>(null);

    const [ offices, setOffices ] = useState<OfficeResponse[]>([]);

    const [ selectedOffice, setSelectedOffice ] = useState<OfficeResponse | null>(null);

    const [ errorOfficeSelected, setErrorOfficeSelected ] = useState<string>('');

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

    const handleSubmit = () => {
        const isValidForm = validateForm();
        const isOfficeValid = formData.office.id !== 0;

        setErrorOfficeSelected(isOfficeValid ? '' : 'Please select an office');
        return isValidForm && isOfficeValid ? formData : null;
    }

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

    return {
        formData,
        values,
        handleSubmit,
        handleOfficeChange,
        handleChange,
        onFocus,
        errorOfficeSelected,
        loading,
        offices
    }

}