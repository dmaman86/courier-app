import { useState, useCallback } from 'react';

import moment from 'moment';
import { FormState } from '@/domain';

export const useForm = <T extends Record<string, any>, K extends FormState | null>(initialState: T, initialFormState: K) => {

    const [ values, setValues ] = useState<FormState | null>(initialFormState);
    const [ state, setState ] = useState<T>(initialState);

    const sanitizeString = (value: any) => {
        return (typeof value === 'string') ? value.trim() : value;
    }

    const validateField = useCallback((fieldName: string, value: any, currentValues: FormState): string[] => {
        const field = currentValues[fieldName];
        const errors: string[] = [];

        for(const rule of field.validation){
            const isValid = rule.isValid(value, currentValues);
            errors.push(isValid ? '' : rule.message);
        }
        return errors;
    }, []);

    const validateForm = useCallback((): T | null => {
        const newValues: FormState = {};
        let sanitizedState = { ...state };

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

            sanitizedState = {
                ...sanitizedState,
                [fieldName]: value
            }
        }
        setValues(newValues);
        return Object.values(newValues).every(field => field.isValid) ? sanitizedState : null;
    }, [values, state, validateField]);

    const extractNameAndValue = (event: any, values: FormState) => {
        let response = { name: '', value: '' };

        if(event.target){
            const { name, value } = event.target;
            response = { name, value };
        } else if(event._isAMomentObject || event instanceof Date){
            response.name = Object.keys(values).find(key => key.toLowerCase().includes('date')) || '';
            response.value = moment(event).format('DD/MM/YYYY');
        }
        return response;
    }

    const updateFormValues = (field: string, value: any, values: FormState, validateField: (fieldName: string, value: any, currentValues: FormState) => string[]) => {
        const fieldErrors = values[field].validateRealTime ? validateField(field, value, values) : [];

        const formattedValue = value === null || Array.isArray(value) ? value : sanitizeString(value);

        return {
            ...values,
            [field]: {
                ...values[field],
                value: formattedValue,
                isValid: fieldErrors.every(error => error === ''),
                error: fieldErrors
            }
        }
    }

    const handleChange = useCallback((event: any) => {
        if(values && state) {
            const { name: fieldName, value } = extractNameAndValue(event, values);
            if(fieldName !== ''){
                const updatedValues = updateFormValues(fieldName, value, values, validateField);
                setValues(updatedValues);

                setState(prevState => ({
                    ...prevState,
                    [fieldName]: value
                }));
                
            }
        }
    }, [values, state]);

    const handleStateChange = useCallback((field: keyof T, stateValue: any, formValue: any) => {
        setState(prevState => ({
            ...prevState,
            [field]: stateValue
        }))

        if(values && values[field as string]){
            const updatedValues = updateFormValues(field as string, formValue, values, validateField);
            setValues(updatedValues);
        }
    }, [values]);

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

    return { values, state, handleChange, handleStateChange, onFocus, validateForm, setValues, setState, updateValues };
}