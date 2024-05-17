import React, { ReactElement, ReactNode } from "react";
import { Token, User } from "./models";
import { ActionMeta, MultiValue, SingleValue } from "react-select";

export interface InputProps{
    label?: string;
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
    value: number;
    label: string;
}

export interface SelectProps{
    options: OptionType[];
    isMulti?: boolean;
    onChange: (selected: MultiValue<OptionType> | SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
    value: MultiValue<OptionType> | SingleValue<OptionType>;
}

export interface AuthContextType {
    tokens: Token | null;
    userDetails: User | null;
    saveTokens: (tokens: Token) => void;
    logout: () => void;
}

export interface ValueColumn {
    key: string;
    label: string;
}

export interface Action<T> {
    label: string;
    classNameButton?: string;
    classNameIcon?: string;
    method: (item: T) => void;
}

export interface GenericTableProps<T extends { id: number }>{
    data: T[] | null;
    columns: ValueColumn[];
    actions?: Action<T>[];
    BodyComponent: React.ComponentType<{ data: T[], actions?: Action<T>[] }>;
}