import { ValidationRule } from "../types";

const isNotEmpty = (value: string): boolean => value.length > 0;


export const validatorForm = ( () => {

    const validaNotEmpty: ValidationRule = {
        validate: (value: string): boolean => isNotEmpty(value),
        message: 'This field is required'
    }

    const isCellularNumber: ValidationRule = {
        validate: (value: string): boolean => /^(05|\+9725)(\d{8}|\d-\d{7}|\d-\d{3}-\d{4}|\d-\d{4}-\d{3})$/.test(value),
        message: 'Please enter a legal cellular number'
    }

    return {
        validaNotEmpty,
        isCellularNumber
    }

})();