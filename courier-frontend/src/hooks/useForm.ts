import { useState, ChangeEvent, useCallback } from 'react';

import { FormState } from '../types';
import moment from 'moment';

export const useForm = (initialState: FormState | null) => {

    const [ values, setValues ] = useState(initialState);

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

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if(values){
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
        }
    }, [values]);

    const handleDateChange = useCallback((date: moment.Moment | null) => {
        if(date && values){
            const formattedDate = date.format('DD/MM/YYYY');
            const updateValues: FormState = { ...values };

            Object.keys(values).forEach(fieldName => {
                if(fieldName.includes('Date')){
                    const fieldErrors = values[fieldName].validateRealTime ?
                                        validateField(fieldName, formattedDate, values) : [];

                    updateValues[fieldName] = {
                        ...values[fieldName],
                        value: formattedDate,
                        isValid: fieldErrors.every(error => error === ''),
                        error: fieldErrors
                    };
                }
            });
            setValues(updateValues);
        }
    }, [values, validateField]);

    const onFocus = useCallback((fieldName: string) => {
        setValues(prev => ({
            ...prev,
            [fieldName]: {
                ...prev![fieldName],
                error: [],
                isValid: true
            }
        }));
    }, []);

    const updateValues = useCallback((newValues: FormState) => {
        setValues(newValues);
    }, []);

    return { values, handleChange, onFocus, validateForm, setValues, handleDateChange, updateValues };
}