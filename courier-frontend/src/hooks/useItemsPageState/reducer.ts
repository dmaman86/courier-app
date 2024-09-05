import { ActionType, Item, State } from "@/domain";

export const initialState = <T extends Item>(): State<T> => ({
    showModal: false,
    showAlertDialog: false,
    selectedItem: null,
    itemToDelete: null,
    pagination: { page: 0, size: 5, totalItems: 0 },
    responseItem: { data: null, error: null },
    responseDelete: { data: null, error: null },
    searchQuery: '',
});

export const reducer = <T extends Item>(state: State<T>, action: ActionType<T>): State<T> => {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return { ...state, showModal: !state.showModal };
        case 'TOGGLE_ALERT_DIALOG':
            return { ...state, showAlertDialog: !state.showAlertDialog };
        case 'SET_SELECTED_ITEM':
            return { ...state, selectedItem: action.payload };
        case 'SET_PAGINATION':
            return { ...state, pagination: action.payload };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_RESPONSE_ITEM':
            return { ...state, responseItem: action.payload };
        case 'SET_DELETE_RESPONSE':
            return { ...state, responseDelete: action.payload };
        case 'RESET_STATE':
            return initialState<T>();
        default:
            return state;
    }
};