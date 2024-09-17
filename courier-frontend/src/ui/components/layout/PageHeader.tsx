import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FormState } from "@/domain";
import { useDebounce, useForm } from "@/hooks";
import { RootState } from "@/redux/store";
import { ReusableInput } from "../form";


interface PageHeaderProps {
    header: {
        title: string;
        placeholder: string;
        buttonName: string;
    };
    search: {
        onSearch: (query: string) => void;
        showSearch: boolean;
        canCreate: boolean;
        query: string;
    }
    onCreate: () => void;
    delay?: number;
}

export const PageHeader = ({ header, search, onCreate, delay = 250 }: PageHeaderProps) => {

    const userDetails = useSelector((state: RootState) => state.auth.userDetails);

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const initialData = {
        search: search.query
    }

    const initialState: FormState = {
        search: {
            value: search.query,
            validation: [],
            validateRealTime: false
        }
    }
    
    const { values, state, handleChange } = useForm(initialData, initialState);

    const debouncedSearch = useDebounce(state.search, delay);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    useEffect(() => {
        search.onSearch(debouncedSearch);
    }, [debouncedSearch, search.onSearch]);

    return(
        <>
            <div className="container">
                <div className="row align-items-center mb-4">
                    <div className="col-12 col-md-4">
                        <h1>{header.title}</h1>
                    </div>
                    <div className="col-12 col-md-8 mt-3 mt-md-0">
                        <div className="row d-flex justify-content-end">
                            {
                                search.showSearch && values && (
                                    <div className="col-6">
                                        <ReusableInput
                                            inputProps={{
                                                name: 'search',
                                                type: 'text',
                                                value: state.search,
                                                placeholder: header.placeholder
                                            }}
                                            onChange={handleChange}
                                            onFocus={() => {}}
                                        />
                                    </div>
                                )
                            }
                            {
                                search.canCreate && (
                                    <div className={`col-${search.canCreate ? '6' : '12'} d-flex justify-content-center`}>
                                        <button onClick={onCreate} className="btn btn-primary">{header.buttonName}</button>
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