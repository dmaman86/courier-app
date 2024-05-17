import React from "react";
import { ReusableInput } from "./ReusableInput";
import { FormState } from "../../types";
import { useForm } from "../../hooks";

interface PageHeaderProps {
    title: string;
    buttonName: string;
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

export const PageHeader = ({ title, buttonName, onSearch, onCreate }: PageHeaderProps) => {

    const { values, handleChange } = useForm(initialState);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        onSearch(e.target.value);
    }

    return(
        <>
            <div className="container">
                <div className="row align-items-center mb-4">
                    <div className="col-12 col-md-6">
                        <h1>{title}</h1>
                    </div>
                    <div className="col-12 col-md-6 justify-content-end align-items-center mt-3 mt-md-0">
                        <div className="row d-flex">
                            <div className="col-8">
                                <ReusableInput
                                    inputProps={{
                                        name: 'search',
                                        type: 'text',
                                        value: values.search.value,
                                        placeholder: 'Search user...'
                                    }}
                                    onChange={handleSearchChange}
                                    onFocus={() => {}}
                                />
                            </div>
                            <div className="col-4">
                                <button onClick={onCreate} className="btn btn-primary ms-3">{buttonName}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}