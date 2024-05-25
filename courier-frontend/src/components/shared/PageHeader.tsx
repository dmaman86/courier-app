import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReusableInput } from "./ReusableInput";
import { FormState } from "../../types";
import { useAuth, useForm } from "../../hooks";
import _ from 'lodash';


interface PageHeaderProps {
    title?: string;
    placeholder: string;
    buttonName: string;
    onSearch?: (query: string) => void;
    onCreate: () => void;
    delay?: number;
    showSearch?: boolean;
}

const initialState: FormState = {
    search: {
        value: '',
        validation: [],
        validateRealTime: false
    }
}

export const PageHeader = ({ title, placeholder, buttonName, onSearch, onCreate, delay = 250, showSearch = true }: PageHeaderProps) => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    
    const { values, handleChange } = useForm(initialState);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    const sendBack = useCallback(() => {
        onSearch && onSearch(values.search.value);
    }, [onSearch, values.search.value]);

    const debouncedRequest = useMemo(() => {
        return _.debounce(sendBack, delay);
    }, [delay, sendBack]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        debouncedRequest();
    }

    return(
        <>
            <div className="container">
                <div className="row align-items-center mb-4">
                    {
                        title && (<div className="col-12 col-md-6">
                                        <h1>{title}</h1>
                                    </div>)
                    }
                    <div className="col-12 col-md-6 mt-3 mt-md-0">
                        <div className="row d-flex justify-content-end">
                            {
                                showSearch && onSearch && (
                                    <div className="col-8">
                                        <ReusableInput
                                            inputProps={{
                                                name: 'search',
                                                type: 'text',
                                                value: values.search.value,
                                                placeholder: placeholder
                                            }}
                                            onChange={handleSearchChange}
                                            onFocus={() => {}}
                                        />
                                    </div>
                                )
                            }
                            {
                                isAdmin && (
                                    <div className={`col-${onSearch ? '4' : '12'} d-flex justify-content-end`}>
                                        <button onClick={onCreate} className="btn btn-primary ms-3">{buttonName}</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}