import { useState, ChangeEvent, useCallback } from 'react';

import { FormState } from '../types';

export const useForm = (initialState: FormState) => {

    const [ values, setValues ] = useState(initialState);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const fieldErrors = values[name].validateRealTime ?
                            validateField(name, value, values) : [];

        const updateValues: FormState = {
            ...values,
            [name]: {
                ...values[name],
                value,
                isValid: fieldErrors.every(error => error === ''),
                error: fieldErrors
            },
        };
        setValues(updateValues);
    }, [values]);

    const onFocus = useCallback((fieldName: string) => {
        setValues(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                error: [],
                isValid: true
            }
        }));
    }, []);

    const validateField = useCallback((fieldName: string, value: string, currentValues: FormState): string[] => {
        const field = currentValues[fieldName];
        const errors: string[] = [];

        for(const rule of field.validation){
            const isValid = rule.isValid(value, currentValues);
            errors.push(isValid ? '' : rule.message);
        }
        return errors;
    }, []);

    const validateForm = useCallback((): boolean => {
        const newValues: FormState = {};
        for(const fieldName in values){
            const field = values[fieldName];
            const value = sanitizeString(field.value);
            const fieldErrors = validateField(fieldName, value, values);
            const isValid = fieldErrors.every(error => error === '');

            newValues[fieldName] = {
                ...field,
                isValid,
                error: fieldErrors
            };
        }
        setValues(newValues);
        return Object.values(newValues).every(field => field.isValid);
    }, [values, validateField]);

    const sanitizeString = (value: string) => {
        return value.trim();
    }

    return { values, handleChange, onFocus, validateForm, setValues };
}