import React, { ReactNode } from "react";

export interface FetchState<T>{
    data: T | null;
    loading: boolean;
    error: unknown;
}

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

export interface RoutesProps {
    tokens?: Token | null;
    user?: User | null;
}

export interface RouteConfig{
    path: string;
    label: string;
    element: ReactNode | (() => ReactNode);
    allowedRoles: string[];
}

export interface NavbarProps {
    tokens: Token | null;
    logout: () => void;
    user: User | null;
    isLoggingIn: boolean;
    updateLogginIn: (loading: boolean) => void;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    data?: unknown
}

export interface FetchConfig {
    url?: string;
    options?: FetchOptions
}

export interface ModalProps {
    title: string;
    body: ReactNode;
    show: boolean;
    onClose: () => void;
}

export interface OptionType {
    value: string;
    label: string;
}

export interface SelectProps {
    value: string | string[];
    options: OptionType[];
    onChange: (value: string | string[]) => void;
    placeholder?: string;
    isMulti?: boolean;
}