import { FetchResponse } from "./axios.models";
import { Item } from "./props.models";

export interface Pagination {
    page: number;
    size: number;
    totalItems: number;
}

export interface State<T extends Item> {
    showModal: boolean;
    showAlertDialog: boolean;
    selectedItem: T | null;
    itemToDelete: T | null;
    pagination: Pagination;
    responseItem: FetchResponse<T>;
    responseDelete: FetchResponse<string>;
    searchQuery: string;
}

export type ActionType<T extends Item> =
    | { type: 'TOGGLE_MODAL' }
    | { type: 'TOGGLE_ALERT_DIALOG' }
    | { type: 'SET_SELECTED_ITEM'; payload: T }
    | { type: 'SET_PAGINATION'; payload: Pagination }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_RESPONSE_ITEM'; payload: FetchResponse<T> }
    | { type: 'SET_DELETE_RESPONSE'; payload: FetchResponse<string> }
    | { type: 'RESET_STATE'; payload: T };