import { useState } from "react";

import { Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';

import { Branch, BranchInfo, FormState, Office, OfficeResponse, OptionType } from "@/domain";
import { ReusableInput } from "../form";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";
import { SelectDetailsForm } from "./SelectDetailsForm";


interface OfficeFormProps {
    office: OfficeResponse;
    setOffice: (office: OfficeResponse) => void;
    onSubmit: (office: OfficeResponse) => void;
}

interface BranchOptionType extends OptionType {
    address: string;
    office: Office;
}

export const OfficeForm = ({ office, setOffice, onSubmit }: OfficeFormProps) => {

    const [ selectedBranches, setSelectedBranches ] = useState<Branch[]>(office.branches as Branch[]);
    const [ branches, setBranches ] = useState<BranchInfo[]>([{ city: '', address: ''}]);

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

    const generateExistBranch = (branches: Branch[]): FormState => {
        const state: FormState = {};

        const value = branches.map(branch => ({ value: branch.id, city: branch.city, address: branch.address }));
        state['branches'] = {
            value: value,
            validation: [{
                isValid: (branches: { city: string, address: string }[]): boolean =>
                    branches.length > 0 && branches.every(branch => branch.city.trim() !== '' && branch.address.trim() !== ''),
                message: 'At least one branch with a valid city and address must be specified'
            }],
            validateRealTime: false
        };
        return state;
    }

    const initialFormState: FormState = {
        name: {
            value: office.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        ...(
            office.branches.length > 0 
                ? generateExistBranch(selectedBranches) 
                : generateBranchInitialState(branches)
        )
    }

    const { values, state, handleChange, handleStateChange, onFocus, validateForm, setValues, setState } = useForm(office, initialFormState);


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const submittedData = validateForm();
    
        if (submittedData) {
            onSubmit(submittedData);
        }
    }

    const addBranch = () => {
        // setBranches([ ...branches, { city: '', address: '' }]);
        const updateBranches = [ ...branches, { city: '', address: '' } ];
        setBranches(updateBranches);

        const index = updateBranches.length - 1;

        setValues(prevValues => ({
            ...prevValues,
            [`city_${index}`]: {
                value: '',
                validation: [ validatorForm.validateNotEmpty ],
                validateRealTime: false
            },
            [`address_${index}`]: {
                value: '',
                validation: [ validatorForm.validateNotEmpty ],
                validateRealTime: false
            }
        }));

        setState(prevState => ({
            ...prevState,
            branches: [ ...prevState.branches, { city: '', address: '' } ]
        }));
    }

    const removeBranch = (index: number) => {
        if (branches.length > 1) {
            const updatedBranches = branches.filter((_, i) => i !== index);
            setBranches(updatedBranches);
    
            // Eliminar los valores correspondientes de 'values'
            setValues(prevValues => {
                const newValues = prevValues ? { ...prevValues } : {};
                delete newValues[`city_${index}`];
                delete newValues[`address_${index}`];
                return newValues;
            });
    
            // Eliminar del estado 'state'
            setState(prevState => ({
                ...prevState,
                branches: prevState.branches.filter((_, i) => i !== index)
            }));
        }
    };


    return(
        <>
            {
                (values) && (
                    <form onSubmit={handleFormSubmit}>
                        <div className="row g-4">
                            <div className="col">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'Name',
                                        name: 'name',
                                        type: 'text',
                                        value: state.name,
                                        placeholder: 'Enter office name'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.name.error}
                                />
                            </div>
                        </div>
                        {
                            (office.id === 0 && branches.length > 0) && (
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
                            (selectedBranches.length > 0) && (
                                <>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <SelectDetailsForm<BranchOptionType>
                                                label='Select Branches:'
                                                initialData={values.branches.value.map((branch: { value: any; city: any; address: any; }) => ({
                                                    value: branch.value,
                                                    label: `${branch.city}\n${branch.address}`,
                                                    address: branch.address,
                                                    office: {id: office.id, name: state.name }
                                                }))}
                                                listOptions={selectedBranches.map(branch => ({
                                                    value: branch.id,
                                                    label: `${branch.city}\n${branch.address}`,
                                                    address: branch.address,
                                                    office: {id: office.id, name: state.name}
                                                }))}
                                                transformData={(selected) => {
                                                    if(Array.isArray(selected)){
                                                        const branches = selected.map(branch => ({ id: branch.value, city: branch.label.split('\n')[0], address: branch.label.split('\n')[1] }));
                                                        handleStateChange('branches', branches, branches.map(branch => `${branch.city}\n${branch.address}`));
                                                    }
                                                }}
                                                isMulti={true}
                                            />
                                            {
                                                values.branches.error && (
                                                    <div className="row">
                                                        <div className="col text-danger">{values.branches.error}</div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
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