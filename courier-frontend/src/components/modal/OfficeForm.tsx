import { useCallback, useEffect, useState } from "react";
import { Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import { MultiValue, SingleValue } from "react-select";
import { useErrorBoundary } from "react-error-boundary";


import { useAsync, useFetchAndLoad, useForm } from "@/hooks";
import { Branch, BranchInfo, BranchOptionType, FetchResponse, FormState, OfficeResponse } from "@/types";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";
import { ReusableInput, ReusableSelect } from "@/components/shared";


interface OfficeFormProps {
    officeId: number | null;
    onSubmit: (role: OfficeResponse) => void;
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

export const OfficeForm = ({ officeId, onSubmit }: OfficeFormProps) => {

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
            city: values[`city_${index}`].value,
            address: values[`address_${index}`].value
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const branches = (!officeId) ? buildListBranchInfo() : selectedBranches;
        if(validateForm() && branches.length > 0){
            const officeToSubmit: OfficeResponse = {
                id: officeId || 0,
                name: values.name.value,
                branches: branches
            };

            if(!officeId){
                const { id, ...rest } = officeToSubmit;
                onSubmit(rest as OfficeResponse);
                console.log(rest);
            }
            onSubmit(officeToSubmit);
        }
        
        
    }

    const handleBranchChange = useCallback((selected: MultiValue<BranchOptionType> | SingleValue<BranchOptionType>) => {
        if(Array.isArray(selected)){
            setSelectedBranches(transformOptionsToBranches(selected));
        }
    }, [selectedBranches]);


    return(
        <>
            {
                !loading && (
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'Name',
                                        name: 'name',
                                        type: 'text',
                                        value: values.name.value,
                                        placeholder: 'Enter office name'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.name.error}
                                />
                            </div>
                        </div>
                        {
                            (!officeId && branches.length > 0) && (
                                branches.map((branch, index) => (
                                    <div key={`branch_${index}`}>
                                        <Divider textAlign="right">
                                            <IconButton size="small" onClick={() => removeBranch(index)}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Divider>
                                        <div className="row">
                                            <div className="col-6">
                                                    <ReusableInput 
                                                        inputProps={{
                                                            label: 'City',
                                                            name: `city_${index}`,
                                                            type: 'text',
                                                            value: values[`city_${index}`]?.value || '',
                                                            placeholder: 'Enter city name'
                                                        }}
                                                        onChange={handleChange}
                                                        onFocus={onFocus}
                                                        errorsMessage={values[`city_${index}`]?.error}
                                                    />
                                            </div>
                                            <div className="col-6">
                                                    <ReusableInput 
                                                        inputProps={{
                                                            label: 'Address',
                                                            name: `address_${index}`,
                                                            type: 'text',
                                                            value: values[`address_${index}`]?.value || '',
                                                            placeholder: 'Enter address'
                                                        }}
                                                        onChange={handleChange}
                                                        onFocus={onFocus}
                                                        errorsMessage={values[`address_${index}`]?.error}
                                                    />
                                            </div>
                                        </div>
                                        {
                                            (index === branches.length - 1) && (
                                                <Divider textAlign="right">
                                                    <IconButton size="small" onClick={addBranch}>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Divider>
                                            )
                                        }
                                    </div>
                                ))
                            )
                        }
                        {
                            (officeId && office) && (
                                <>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <ReusableSelect<BranchOptionType>
                                                label='Select Branches:'
                                                value={selectedBranches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address }))}
                                                options={office.branches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address }))}
                                                onChange={handleBranchChange}
                                                isMulti
                                            />
                                        </div>
                                    </div>
                                    {
                                        !selectedBranches.length && (
                                            <div className="row">
                                                <div className="col text-danger">This field is required.</div>
                                            </div>
                                        )
                                    }
                                </>
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