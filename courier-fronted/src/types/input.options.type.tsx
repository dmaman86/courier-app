export interface InputOptions {
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date';
    value: string;
    onChange: ({target}: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    resetError?: (errorMessage?: string) => void;
    placeholder?: string;
}