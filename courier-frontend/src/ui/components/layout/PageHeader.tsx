import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { FormState } from "@/domain";
import { useForm } from "@/hooks";
import { RootState } from "@/redux/store";
import _ from 'lodash';
import { ReusableInput } from "../form";


interface PageHeaderProps {
    title: string;
    placeholder: string;
    buttonName: string;
    onSearch?: (query: string) => void;
    onCreate: () => void;
    delay?: number;
    showSearch?: boolean;
    canCreate: boolean;
}

const initialState: FormState = {
    search: {
        value: '',
        validation: [],
        validateRealTime: false
    }
}

export const PageHeader = ({ title, placeholder, buttonName, onSearch, onCreate, delay = 250, showSearch = true, canCreate }: PageHeaderProps) => {

    const userDetails = useSelector((state: RootState) => state.auth.userDetails);

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    
    const { values, handleChange } = useForm(initialState);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    const sendBack = useCallback(() => {
        onSearch && onSearch(values?.search.value!);
    }, [onSearch, values?.search.value]);

    const debouncedRequest = useMemo(() => {
        return _.debounce(sendBack, delay);
    }, [delay, sendBack]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleChange(e);
        debouncedRequest();
    }

    return(
        <>
            <div className="container">
                <div className="row align-items-center mb-4">
                    <div className="col-12 col-md-4">
                        <h1>{title}</h1>
                    </div>
                    <div className="col-12 col-md-8 mt-3 mt-md-0">
                        <div className="row d-flex justify-content-end">
                            {
                                showSearch && onSearch && (
                                    <div className="col-6">
                                        <ReusableInput
                                            inputProps={{
                                                name: 'search',
                                                type: 'text',
                                                value: values?.search.value!,
                                                placeholder: placeholder
                                            }}
                                            onChange={handleSearchChange}
                                            onFocus={() => {}}
                                        />
                                    </div>
                                )
                            }
                            {
                                canCreate && (
                                    <div className={`col-${onSearch ? '6' : '12'} d-flex justify-content-center`}>
                                        <button onClick={onCreate} className="btn btn-primary">{buttonName}</button>
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