export interface ValidationRule<T = string>{
    isValid: (value: T, formData?: FormState) => boolean;
    message: string;
}

export interface FormField<T>{
    value: T;
    validation: ValidationRule<T>[];
    isValid?: boolean;
    error?: string[];
    validateRealTime?: boolean;
}

export type FormState = Record<string, FormField<any>>;

export interface FormProps<T> {
    onSubmit: (item: Partial<T>) => Promise<void>;
    itemId?: number;
}



