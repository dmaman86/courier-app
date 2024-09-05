
import { useCallback, useEffect, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import { useErrorBoundary } from "react-error-boundary";


import { useAsync, useFetchAndLoad, useForm } from "@/hooks";
import { Branch, BranchInfo, BranchOptionType, FetchResponse, FormState, OfficeResponse } from "@/domain";
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

export const useOfficeForm = (officeId: number | null) => {

    const { loading, callEndPoint } = useFetchAndLoad();

    const { showBoundary } = useErrorBoundary();

    const [ office, setOffice ] = useState<OfficeResponse | null>(null);

    const [ branches, setBranches ] = useState<BranchInfo[]>([{ city: '', address: ''}]);
    const [ selectedBranches, setSelectedBranches ] = useState<Branch[]>([]);

    const generateBranchInitialState = (branches: BranchInfo[]): FormState => {
        const state: FormState = {};
        branches.forEach((branch, index) => {
            state[`city_${index}`] = {
                value: branch.city,
                validation: [ validatorForm.validateNotEmpty ],
                validateRealTime: false
            };
            state[`address_${index}`] = {
                value: branch.address,
                validation: [ validatorForm.validateNotEmpty ],
                validateRealTime: false
            };
        });
        return state;
    }

    const initialState: FormState = {
        name: {
            value: '',
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        ...generateBranchInitialState(branches)
    };

    const { values, handleChange, onFocus, validateForm, setValues } = useForm(initialState);

    const fetchOfficeDetails = async() => {
        if(!officeId) return Promise.resolve({ data: null, error: null });

        return await callEndPoint(serviceRequest.getItem<OfficeResponse>(`${paths.courier.offices}id/${officeId}`));
    }

    const handleOfficeDetailsSuccess = (response: FetchResponse<OfficeResponse>) => {
        if(officeId){
            if(response.data) setOffice(response.data);
            else showBoundary(response.error);
        }
    }

    useAsync(fetchOfficeDetails, handleOfficeDetailsSuccess, () => {}, [officeId]);

    useEffect(() => {
        if(office){
            const updatedInitialState = {
                name: {
                    value: office.name,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                }
            }
            setValues(updatedInitialState);
            setSelectedBranches(office.branches as Branch[]);
        }
    }, [office]);

    useEffect(() => {
        const updatedState = generateBranchInitialState(branches);
        setValues(prevValues => ({
            ...prevValues,
            ...updatedState
        }));
        
    }, [branches, setValues]);

    const addBranch = () => {
        setBranches([ ...branches, { city: '', address: '' }]);
    }

    const removeBranch = (index: number) => {
        if(branches.length > 1){
            const newBranches = branches.filter((_, i) => i !== index);
            setBranches(newBranches);
        }
    }

    const buildListBranchInfo = () => {
        return branches.map((_, index) => ({
            city: values![`city_${index}`].value,
            address: values![`address_${index}`].value
        }))
    }

    const handleSubmit = () => {

        const branches = (!officeId) ? buildListBranchInfo() : selectedBranches;
        const isValid = validateForm() && branches.length > 0;

        if(isValid){
            const officeToSubmit: OfficeResponse = {
                id: officeId || 0,
                name: values!.name.value,
                branches: branches
            };

            if(!officeId){
                const { id, ...rest } = officeToSubmit;
                return rest as OfficeResponse;
            }
            return officeToSubmit;
        }
        return null;
    }

    const handleBranchChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(Array.isArray(selected)){
            setSelectedBranches(transformOptionsToBranches(selected));
        }
    }, [selectedBranches]);

    return {
        values,
        loading,
        branches,
        selectedBranches,
        office,
        handleChange,
        onFocus,
        addBranch,
        removeBranch,
        handleSubmit,
        handleBranchChange
    } 
}