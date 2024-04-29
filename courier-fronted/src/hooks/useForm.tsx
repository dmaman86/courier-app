import { useState, ChangeEvent } from 'react';

import { FormState } from '../types';

export const useForm = <T extends FormState>(initialState: T) => {
    const [ values, setValues ] = useState<T>(initialState);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: { ...prev[name], value}
        }));
    }

    const onFocus = (fieldName: string) => {
        const newValues = { ...values };
        newValues[fieldName].error = '';
        newValues[fieldName].isValid = true;
        setValues(newValues);
    }

    const validateField = (fieldName: string, value: string) => {
        const field = values[fieldName];
        if(!field) return { isValid: true, error: '' };

        for(const validationRule of field.validation){
            const isValid = validationRule.validate(value);
            if(!isValid){
                return { isValid: false, error: validationRule.message };
            }
        }
        return { isValid: true, error: '' };
    }

    const validateForm = () => {
        sanitizeValues();
        const newValues = { ...values };
        let isFormValid = true;
        for(const key in newValues){
            const { isValid, error } = validateField(key, newValues[key].value);
            newValues[key].isValid = isValid;
            newValues[key].error = error;
            if(!isValid) isFormValid = false;
        }
        setValues(newValues);
        return isFormValid;
    }

    const sanitizeValues = () => {
        const newValues = { ...values };
        Object.keys(newValues).forEach((fieldName) => {
            const field = newValues[fieldName];
            if(field.value && typeof field.value === 'string'){
                field.value = sanitizeString(field.value);
            }
        });
        setValues(newValues);
    }

    const sanitizeString = (value: string) => {
        return value.trim();
    }

    return { values, handleChange, onFocus, validateForm };
}