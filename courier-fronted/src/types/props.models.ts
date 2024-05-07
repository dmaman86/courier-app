import React, { ReactElement, ReactNode } from "react";
import { Token, User } from "./models";
import { CustomError } from "./axios.models";

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

export interface RoutesProps {
    tokens?: Token | null;
    user?: User | null;
}

export interface RouteConfig{
    path: string;
    label: string;
    element?: ReactElement;
    allowedRoles: string[];
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

export interface AuthContextType {
    tokens: Token | null;
    userDetails: User | null;
    saveTokens: (tokens: Token) => void;
    logout: () => void;
    error: CustomError | null;
}

export interface ValueColumn<T> {
    key: string;
    label: string;
    render?: (item: T) => string;
}

export interface Action<T> {
    label: string;
    method: (item: T) => void;
}

export interface GenericTableProps<T extends { id: number }>{
    data: T[] | null;
    columns: ValueColumn<T>[];
    actions?: Action<T>[];
    BodyComponent: React.ComponentType<{ data: T[], actions?: Action<T>[] }>;
}