import React, { ReactElement, ReactNode } from "react";
import { Token, User } from "./models";
import { MultiValue, SingleValue } from "react-select";
import { AxiosCall, FetchResponse, PageResponse } from "./axios.models";

export interface InputProps{
    label?: string;
    type: string;
    value: string;
    name: string;
    placeholder?: string;
}

export interface GenericInputProps{
    inputProps: InputProps;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus: (fieldName: string) => void;
    errorsMessage?: string[];
}

export interface RoutesProps {
    tokens?: Token | null;
    user?: User | null;
}

export interface RouteConfig{
    path: string;
    label: string;
    element: ReactElement;
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

export interface BranchOptionType extends OptionType{
    address: string;
}

export interface SelectProps<T>{
    label: string;
    value: MultiValue<T> | SingleValue<T>;
    options: T[];
    onChange: (selected: MultiValue<T> | SingleValue<T>) => void;
    isMulti?: boolean;
    isDisabled?: boolean;
}

export interface AuthContextType {
    tokens: Token | null;
    userDetails: User | null;
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
    BodyComponent: React.ComponentType<{ data: T[], actions?: Action<T>[], userDetails?: User }>;
    pagination: { page: number, size: number, totalItems: number };
    onPageChange: (event: unknown, page: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ListProps<T>{
    data: T[];
    actions?: Action<T>[];
}

export interface State<T> {
    showModal: boolean;
    showAlertDialog: boolean;
    selectedItem: number | null;
    itemToDelete: number | null;
    responseList: T[] | null;
    responseItem: FetchResponse<T>;
    responseDelete: FetchResponse<string>;
    searchQuery: string;
    pagination: { page: number, size: number, totalItems: number }
}

export interface Item {
    id: number;
}

export interface ItemsPageProps<T extends Item> {
    userDetails: User;
    title: string;
    placeholder: string;
    buttonName: string;
    fetchItems: (page: number, size: number) => AxiosCall<PageResponse<T[]>>;
    createOrUpdateItem: (item: T) => AxiosCall<T>;
    deleteItem: (itemId: number) => AxiosCall<string>;
    searchItem?: (search: string, page: number, size: number) => AxiosCall<PageResponse<T[]>>;
    renderItemForm: (item: number | null, onSubmit: (item: T) => void) => JSX.Element;
    columns: ValueColumn[];
    renderItemList: React.ComponentType<{ data: T[], actions?: Action<T>[] }>;
    showSearch?: boolean;
    allowedRoles: {
        create: string[];
        update: string[];
        delete: string[];
    }
}