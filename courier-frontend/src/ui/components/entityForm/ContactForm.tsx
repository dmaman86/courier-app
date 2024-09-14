import React, { useState } from "react";

import { Branch, Contact, FormProps, FormState, Office, OfficeResponse, OptionType } from "@/domain";
import { ReusableInput, SelectDetailsForm } from "../form";
import { paths, validatorForm } from "@/helpers";
import { useForm } from "@/hooks";
import { serviceRequest } from "@/services";

interface BranchOptionType extends OptionType {
    address: string;
    office: Office;
}

export const ContactForm = <T extends Contact>({ item, onSubmit }: FormProps<T>) => {

    const [ branches, setBranches ] = useState<Branch[]>(item.branches);

    const initialFormState: FormState = {
        name: {
            value: item.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        lastName: {
            value: item.lastName,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        },
        phone: {
            value: item.phone,
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.isCellularNumber
            ],
            validateRealTime: false
        },
        office: {
            value: item.office,
            validation: [{
                isValid: (value: Office): boolean => value !== null,
                message: 'Select an office'
            }],
            validateRealTime: false
        },
        branches: {
            value: item.branches,
            validation: [{
                isValid: (branches: any[]): boolean => branches.length > 0,
                message: 'At least one branch must be selected'
            }],
            validateRealTime: false
        }
    }

    const { values, state, handleChange, handleStateChange, onFocus, validateForm } = useForm(item, initialFormState);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const submittedData = validateForm();
    
        if (submittedData) {
            onSubmit(submittedData);
        }
    }

    return(
        <>
            {
                (values) && (
                    <form onSubmit={handleFormSubmit} className='row g-4'>
                        <div className='col-6'>
                            <ReusableInput
                                inputProps={{
                                    label: 'Contact Name',
                                    name: 'name',
                                    type: 'text',
                                    value: state.name,
                                    placeholder: 'Enter contact name'
                                }}
                                onChange={handleChange}
                                onFocus={onFocus}
                                errorsMessage={values.name.error}
                            />    
                        </div>
                        <div className='col-6'>
                            <ReusableInput
                                inputProps={{
                                    label: 'Contact Last Name',
                                    name: 'lastName',
                                    type: 'text',
                                    value: state.lastName,
                                    placeholder: 'Enter contact last name'
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
                                        label: 'Contact Phone',
                                        name: 'phone',
                                        type: 'tel',
                                        value: state.phone,
                                        placeholder: 'Enter contact phone'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.phone.error}
                                />    
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <SelectDetailsForm<OptionType, OfficeResponse>
                                    label='Select Office:'
                                    initialData={{
                                        value: state.office.id,
                                        label: state.office.name
                                    }}
                                    listOptions={null}
                                    formatLabel={(office: OfficeResponse) => ({
                                        value: office.id,
                                        label: office.name,
                                        branches: office.branches
                                    })}
                                    transformData={(selected) => {
                                        if(!Array.isArray(selected)){
                                            const office: Office = {
                                                id: (selected as OptionType).value,
                                                name: (selected as OptionType).label
                                            }
                                            handleStateChange('office', office, office);
                                            setBranches((selected as OfficeResponse).branches as Branch[]);
                                        }
                                        
                                    }}
                                    isMulti={false}
                                    fetchItem={() => serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}all`)}
                                />
                                {
                                    values.office.error && (
                                        <div className="row">
                                            <div className="col text-danger">{values.office.error}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                {
                                    branches.length > 0 && (
                                        <SelectDetailsForm<BranchOptionType> 
                                            label='Select Branches:'
                                            initialData={state.branches.map(branch => ({ 
                                                value: branch.id, 
                                                label: `${branch.city}\n${branch.address}`, 
                                                address: branch.address,
                                                office: state.office
                                            }))}
                                            listOptions={branches.map(branch => ({
                                                value: (branch as Branch).id,
                                                label: `${branch.city}\n${branch.address}`,
                                                address: branch.address,
                                                office: state.office
                                            }))}
                                            transformData={(selected) => {
                                                if(Array.isArray(selected)){
                                                    const selectedBranches: Branch[] = selected.map(branch => ({
                                                        id: branch.value,
                                                        city: branch.label.split('\n')[0],
                                                        address: branch.address,
                                                    }));
                                                    handleStateChange('branches', selectedBranches, selectedBranches);
                                                }
                                            }}
                                            isMulti={true}
                                        />
                                    )
                                }
                                {
                                    values.branches.error && (
                                        <div className="row">
                                            <div className="col text-danger">{values.branches.error}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
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