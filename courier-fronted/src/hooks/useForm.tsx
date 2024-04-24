import { useState, ChangeEvent } from 'react';

interface FormValues{
    [key: string]: string;
}

export const useForm = (initialState: FormValues) => {
    const [values, setValues] = useState<FormValues>(initialState);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    }

    return { values, onChange };
}