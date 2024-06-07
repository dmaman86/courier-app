import moment from "moment";
import { ValidationRule } from "../types";

const isNotEmpty = (value: string): boolean => value.length > 0;


export const validatorForm = ( () => {

    const validateNotEmpty: ValidationRule = {
        isValid: (value: string): boolean => isNotEmpty(value),
        message: 'This field is required'
    }

    const validateMinLength: ValidationRule = {
        isValid: (value: string): boolean => value.length >= 5,
        message: 'Password must contain at least 5 characters'
    }

    const isCellularNumber: ValidationRule = {
        isValid: (value: string): boolean => /^(05|\+9725)(\d{8}|\d-\d{7}|\d-\d{3}-\d{4}|\d-\d{4}-\d{3})$/.test(value),
        message: 'Please enter a legal cellular number'
    }

    const isEmail: ValidationRule = {
        isValid: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    }

    const isEmailOrPhone: ValidationRule = {
        isValid: (value: string): boolean => isEmail.isValid(value) || isCellularNumber.isValid(value),
        message: 'Please enter a valid email address or cellular number'
    }

    const isDate: ValidationRule = {
        isValid: (value: string): boolean => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value),
        message: 'Please enter a valid date'
    }

    const isSelectedDateValid: ValidationRule = {
        isValid: (value: string): boolean => moment(value, 'DD/MM/YYYY').isAfter(moment()),
        message: 'Please select a valid date'
    }

    return {
        validateNotEmpty,
        validateMinLength,
        isCellularNumber,
        isEmail,
        isEmailOrPhone,
        isDate,
        isSelectedDateValid
    }

})();