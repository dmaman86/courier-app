import { BranchResponse, FormProps, FormState, OfficeResponse, OptionType } from "@/domain";
import { ReusableInput, SelectDetailsForm } from "../form";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";
import { useForm } from "@/hooks";

/*interface BranchFormProps {
    branch: BranchResponse;
    onSubmit: (branch: BranchResponse) => void;
}*/

export const BranchForm = <T extends BranchResponse>({ item, onSubmit, onClose }: FormProps<T>) => {

    const initialFormState: FormState = {
        city: {
            value: item.city,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        address: {
            value: item.address,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        office: {
            value: item.office,
            validation: [{
                isValid: (value: OfficeResponse) => value.id !== 0,
                message: 'Please select an office'
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

    return (
        <>
            {
                (values) && (
                    <form onSubmit={handleFormSubmit}>
                        <div className="row g-4">
                            <div className="col-6">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'City',
                                        name: 'city',
                                        type: 'text',
                                        value: state.city,
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
                                        value: state.address,
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
                                <SelectDetailsForm<OptionType, OfficeResponse>
                                    label='Select Office:'
                                    initialData={{
                                        value: state.office.id,
                                        label: state.office.name
                                    }}
                                    listOptions={null}
                                    formatLabel={(office) => ({ value: office.id, label: office.name })}
                                    transformData={(selected) => {
                                        const office = {
                                            id: (selected as OptionType).value,
                                            name: (selected as OptionType).label
                                        }
                                        handleStateChange('office', office, office);
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
                        <div className="row">
                            <div className="col pt-3 text-center">
                                <button className="btn btn-primary" type="submit">Save</button>
                                { onClose && (<button className='btn btn-secondary ms-2' onClick={onClose}>Cancel</button>) }
                            </div>
                        </div>
                    </form>
                )
            }
        </>
    )
}