import { FetchResponse, Item } from "@/domain";
import { useCallback, useReducer } from "react";
import { initialState, reducer } from "./reducer";

export const useItemsPage = <T extends Item>(initialItem: T) => {

    const [state, dispatch] = useReducer(reducer, initialState<T>(initialItem));

    const toggleModal = useCallback(() => dispatch({ type: 'TOGGLE_MODAL' }), []);
    
    const toggleAlertDialog = useCallback(() => dispatch({ type: 'TOGGLE_ALERT_DIALOG' }), []);
    
    const setSelectedItem = useCallback((item: T) => dispatch({ type: 'SET_SELECTED_ITEM', payload: item }), []);
    
    const setPagination = useCallback((page: number, size: number, totalItems: number) => {
        dispatch({ type: 'SET_PAGINATION', payload: { page, size, totalItems } });
    }, []);
    
    const setSearchQuery = useCallback((query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    }, []);

    const setResponseItem = useCallback((response: FetchResponse<T>) => {
        dispatch({ type: 'SET_RESPONSE_ITEM', payload: response });
    }, []);

    const setDeleteResponse = useCallback((response: FetchResponse<string>) => {
        dispatch({ type: 'SET_DELETE_RESPONSE', payload: response });
    }, []);

    return {
        state,
        toggleModal,
        toggleAlertDialog,
        setSelectedItem,
        setPagination,
        setSearchQuery,
        setResponseItem,
        setDeleteResponse,
        dispatch,
    };
};