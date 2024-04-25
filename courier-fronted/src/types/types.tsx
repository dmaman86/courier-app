export interface FetchState<T>{
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export interface FormLoginState{
    username: string;
    password: string;
}

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
}

export interface InputOptions {
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date';
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    resetError?: (errorMessage?: string) => void;
    placeholder?: string;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}