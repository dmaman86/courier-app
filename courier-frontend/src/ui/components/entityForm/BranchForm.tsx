import { BranchResponse, OfficeResponse, OptionType } from "@/domain";
import { useBranchForm } from "@/useCases";
import { ReusableInput, ReusableSelect } from "../form";

interface BranchFormProps {
    branchId: number | null;
    onSubmit: (branch: BranchResponse) => void;
}

const tranformOffices = (offices: OfficeResponse[]): OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

export const BranchForm = ({ branchId, onSubmit }: BranchFormProps) => {
    
    const { formData,
            values,
            handleSubmit,
            handleOfficeChange,
            handleChange,
            onFocus,
            errorOfficeSelected,
            loading,
            offices } = useBranchForm(branchId);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const submittedData = handleSubmit();
    
        if (submittedData) {
            onSubmit(submittedData);
        }
    }

    return (
        <>
            {
                (!loading && values) && (
                    <form onSubmit={handleFormSubmit}>
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