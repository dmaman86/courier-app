import { useCallback, useEffect, useState } from "react";

import { FetchResponse, FormState, Role } from "@/types";
import { paths, validatorForm } from "@/helpers";
import { useFetchAndLoad, useForm } from "@/hooks";
import { ReusableInput } from "@/components/shared";
import { serviceRequest } from "@/services";


interface RoleFormProps {
    roleId: number | null;
    onSubmit: (role: Role) => void;
}

export const RoleForm = ({ roleId, onSubmit }: RoleFormProps) => {

    const [ formData, setFormData ] = useState<Role>({
        id: 0,
        name: ''
    });

    const { loading, callEndPoint } = useFetchAndLoad();

    const [ responseFetch, setResponseFetch ] = useState<FetchResponse<Role>>({ data: null, error: null });

    const initialState: FormState = {
        name: {
            value: formData.name,
            validation: [
                validatorForm.validateNotEmpty
            ],
            validateRealTime: false
        }
    };

    const { values, handleChange, onFocus, validateForm, setValues } = useForm(initialState);

    useEffect(() => {
        if(values){
            setFormData({
                ...formData,
                name: values.name.value
            });
        }
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as Role);
        }
    }, [formData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm()){
            onSubmit(formData);
        }
    }

    const fetchRoleDetails = useCallback(async(roleId: number) => {
        const response = await callEndPoint(serviceRequest.getItem<Role>(`${paths.courier.roles}id/${roleId}`));
        setResponseFetch(response);
    }, [callEndPoint]);

    useEffect(() => {
        if(roleId !== null && !responseFetch.data && !responseFetch.error)
            fetchRoleDetails(roleId);
    }, [roleId, responseFetch, fetchRoleDetails]);

    useEffect(() => {
        if(!loading && responseFetch.data && !responseFetch.error){
            console.log(responseFetch.data);
            setFormData({
                id: Number(responseFetch.data.id),
                name: responseFetch.data.name
            });

            setValues({
                name: {
                    value: responseFetch.data.name,
                    validation: [
                        validatorForm.validateNotEmpty
                    ],
                    validateRealTime: false
                }
            })
        }
            
    }, [loading, responseFetch]);

    return (
        <>
            {
                (!loading && values) && (
                    <form onSubmit={handleSubmit} className="row g-4">
                        <div className="col-6">
                            <ReusableInput
                                inputProps={{
                                    label: 'Role Name',
                                    name: 'name',
                                    type: 'text',
                                    value: values.name.value,
                                    placeholder: 'Enter role name'
                                }}
                                onChange={handleChange}
                                onFocus={onFocus}
                                errorsMessage={values.name.error}
                            />
                        </div>
                        <div className='col pt-3 text-center'>
                            <button className='btn btn-primary' type='submit'>Save</button>
                        </div>
                    </form>
                )
            }
        </>
    );
}