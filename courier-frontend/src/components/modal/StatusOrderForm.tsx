import { useCallback, useEffect, useState } from "react";

import { FetchResponse, FormState, StatusOrder } from "@/types";
import { useFetchAndLoad, useForm } from "@/hooks";
import { paths, validatorForm } from "@/helpers";
import { serviceRequest } from "@/services";
import { ReusableInput } from "@/components/shared";

interface StatusOrderFormProps {
    statusOrderId: number | null;
    onSubmit: (statusOrder: StatusOrder) => void;
}

export const StatusOrderForm = ({ statusOrderId, onSubmit}: StatusOrderFormProps) => {

    const [ formData, setFormData ] = useState<StatusOrder>({
        id: 0, name: ''
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
        }
    }

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
            setFormData(rest as StatusOrder);
        }
    }, [formData.id]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(validateForm()) onSubmit(formData);
    }

    const fetchStatusOrderDetails = useCallback(async(statusOrderId: number) => {
        const result = await callEndPoint(serviceRequest.getItem<StatusOrder>(`${paths.courier.statusOrder}id/${statusOrderId}`));
        setResponse(result);
    }, [callEndPoint]);

    useEffect(() => {
        if(statusOrderId !== null && !response.data && !response.error){
            fetchStatusOrderDetails(statusOrderId);
        }
    }, [statusOrderId, response, fetchStatusOrderDetails]);

    useEffect(() => {
        if(!loading && response.data && !response.error){
            setFormData({
                id: Number(response.data.id),
                name: response.data.name
            });

            setValues({
                name: {
                    value: response.data.name,
                    validation: [ validatorForm.validateNotEmpty ],
                    validateRealTime: false
                }
            })
        }
    }, [loading, response]);

    return(
        <>
            {
                (!loading && values) && (
                    <form onSubmit={ handleSubmit } className="row g-4">
                        <div className="col-6">
                            <ReusableInput 
                                inputProps={{
                                    label: 'Status Order Name',
                                    name: 'name',
                                    type: 'text',
                                    value: values.name.value,
                                    placeholder: 'Enter status order name'
                                }}
                                onChange={handleChange}
                                onFocus={onFocus}
                                errorsMessage={values.name.error}
                            />
                        </div>
                        <div className="col pt-3 text-center">
                            <button className="btn btn-primary" type="submit">Save</button>
                        </div>
                    </form>
                )
            }
        </>
    )
}