import React from "react";
import { ReusableInput } from "./ReusableInput";
import { FormState } from "../../types";
import { useForm } from "../../hooks";

interface PageHeaderProps {
    title: string;
    onSearch: (query: string) => void;
    onCreate: () => void;
}

const initialState: FormState = {
    search: {
        value: '',
        validation: [],
        validateRealTime: false
    }
}

export const PageHeader = ({ title, onSearch, onCreate }: PageHeaderProps) => {

    const { values, handleChange } = useForm(initialState);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        onSearch(e.target.value);
    }

    return(
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{title}</h1>
                <div className="d-flex align-items-center">
                    <ReusableInput
                            inputProps={{
                                label: 'Search',
                                name: 'search',
                                type: 'text',
                                value: values.search.value,
                                placeholder: 'Search...'
                            }}
                            onChange={handleSearchChange}
                            onFocus={() => {}}
                        />
                    
                    <button onClick={onCreate} className="btn btn-primary ms-3">Create</button>
                </div>
            </div>
        </>
    );
}