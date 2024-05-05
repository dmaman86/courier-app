export interface ValidationRule{
    validate: (value: string) => boolean;
    message: string;
}

export interface FormField<T>{
    value: T;
    validation: ValidationRule[];
    isValid?: boolean;
    error?: string;
    validateRealTime?: boolean;
}

export type FormState = Record<string, FormField<string>>;



