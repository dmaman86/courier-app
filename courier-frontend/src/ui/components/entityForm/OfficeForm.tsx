import { Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';

import { Branch, BranchOptionType, OfficeResponse } from "@/domain";
import { useOfficeForm } from "@/useCases";
import { ReusableInput, ReusableSelect } from "../form";


interface OfficeFormProps {
    officeId: number | null;
    onSubmit: (office: OfficeResponse) => void;
}

export const OfficeForm = ({ officeId, onSubmit }: OfficeFormProps) => {


    const { values,
            loading,
            branches,
            selectedBranches,
            office,
            handleChange,
            onFocus,
            addBranch,
            removeBranch,
            handleSubmit,
            handleBranchChange } = useOfficeForm(officeId);


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
                    <form onSubmit={handleFormSubmit}>
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