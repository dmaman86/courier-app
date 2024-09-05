import { useCallback, useEffect, useState } from "react";


import { useFetchAndLoad, useForm } from "@/hooks";
import { Role, FetchResponse, FormState } from "@/domain";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";

export const useRoleForm = (roleId: number | null) => {

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

    const handleSubmit = () => {

        return validateForm() ? formData : null;
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

    return {
        loading,
        formData,
        values,
        handleChange,
        onFocus,
        handleSubmit
    };

}