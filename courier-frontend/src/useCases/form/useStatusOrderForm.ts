import { useCallback, useEffect, useState } from "react";

import { FetchResponse, FormState, StatusOrder } from "@/domain";
import { useFetchAndLoad, useForm } from "@/hooks";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";

export const useStatusOrderForm = (statusId: number | null) => {

    const [ formData, setFormData ] = useState<StatusOrder>({
        id: 0, name: '', description: ''
    });

    const { loading, callEndPoint } = useFetchAndLoad();

    const [ response, setResponse ] = useState<FetchResponse<StatusOrder>>({
        data: null, error: null
    });

    const initialState: FormState = {
        name: {
            value: formData.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        description: {
            value: formData.description,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        }
    }

    const { values, handleChange, onFocus, validateForm, setValues } = useForm(initialState);

    useEffect(() => {
        if(values){
            setFormData({
                ...formData,
                name: values.name.value,
                description: values.description.value
            });
        }
    }, [values]);

    useEffect(() => {
        if(formData.id === 0){
            const { id, ...rest } = formData;
            setFormData(rest as StatusOrder);
        }
    }, [formData.id]);

    const handleSubmit = () => {
        return validateForm() ? formData : null;
    }

    const fetchStatusOrderDetails = useCallback(async(statusOrderId: number) => {
        const result = await callEndPoint(serviceRequest.getItem<StatusOrder>(`${paths.courier.statusOrder}id/${statusOrderId}`));
        setResponse(result);
    }, [callEndPoint]);

    useEffect(() => {
        if(statusId !== null && !response.data && !response.error){
            fetchStatusOrderDetails(statusId);
        }
    }, [statusId, response, fetchStatusOrderDetails]);

    useEffect(() => {
        if(!loading && response.data && !response.error){
            setFormData({
                id: Number(response.data.id),
                name: response.data.name,
                description: response.data.description
            });

            setValues({
                name: {
                    value: response.data.name,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                },
                description: {
                    value: response.data.description,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                }
            })
        }
    }, [loading, response]);

    return {
        loading,
        formData,
        values,
        handleChange,
        onFocus,
        handleSubmit
    }

}