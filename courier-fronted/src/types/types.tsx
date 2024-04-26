export interface FetchState<T>{
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export interface ValidationRule{
    validate: (value: string) => boolean;
    errorMessage: string;
}

export interface FormField<T>{
    value: T;
    validation: ValidationRule[];
    isValid?: boolean;
    error?: string;
}

export type FormState = Record<string, FormField<string>>;

export interface InputProps{
    label: string;
    type: string;
    value: string;
    name: string;
    placeholder?: string;
}

export interface GenericInputProps{
    inputProps: InputProps;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (fieldName: string) => void;
    errorMessage?: string;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    lastName: string;
    phone: string;
    roles: Role[];
}