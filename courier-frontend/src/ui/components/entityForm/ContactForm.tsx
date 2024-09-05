import { Branch, BranchOptionType, Contact, OfficeResponse, OptionType } from "@/domain";
import { useContactForm } from "@/useCases";
import { ReusableInput, ReusableSelect } from "../form";


interface ContactFormProps {
    contactId: number | null;
    onSubmit: (contact: Contact) => void;
}

const tranformOffices = (offices: OfficeResponse[]): OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

export const ContactForm = ({ contactId, onSubmit }: ContactFormProps) => {

    const { formData,
            values,
            handleSubmit,
            handleOfficeChange,
            handleBranchChange,
            handleChange,
            onFocus,
            errorOfficeSelected,
            errorBranchSelected,
            loading,
            offices,
            selectedOffice } = useContactForm(contactId);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const submittedData = handleSubmit();
    
        if (submittedData) {
            onSubmit(submittedData);
        }
    }

    return(
        <>
            {
                (!loading && values) && (
                    <form onSubmit={handleFormSubmit} className='row g-4'>
                        <div className='col-6'>
                            <ReusableInput
                                inputProps={{
                                    label: 'Contact Name',
                                    name: 'name',
                                    type: 'text',
                                    value: values.name.value,
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
                                    value: values.lastName.value,
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
                                        value: values.phone.value,
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