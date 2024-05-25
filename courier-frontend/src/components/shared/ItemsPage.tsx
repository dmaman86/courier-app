import { useCallback, useEffect, useReducer } from "react";
import { Action, FetchResponse, Item, ItemsPageProps, State } from "../../types";
import { useFetchAndLoad, useList } from "../../hooks";
import { PageHeader } from "./PageHeader";
import { CircularProgress } from "@mui/material";
import { ReusableTable } from "./ReusableTable";
import { GenericModal } from "../modal";
import { AlertDialog } from "./AlertDialog";

type ActionType<T> =
    | { type: 'TOGGLE_MODAL' }
    | { type: 'TOGGLE_ALERT_DIALOG' }
    | { type: 'SET_SELECTED_ITEM'; payload: number | null }
    | { type: 'SET_ITEM_TO_DELETE'; payload: number | null }
    | { type: 'SET_RESPONSE_LIST'; payload: FetchResponse<T[]> }
    | { type: 'SET_RESPONSE_ITEM'; payload: FetchResponse<T> }
    | { type: 'SET_DELETE_RESPONSE'; payload: FetchResponse<string> }
    | { type: 'RESET_STATE' };

const initialState = <T extends Item>(): State<T> => ({
    showModal: false,
    showAlertDialog: false,
    selectedItem: null,
    itemToDelete: null,
    responseList: { data: null, error: null },
    responseItem: { data: null, error: null },
    responseDelete: { data: null, error: null },
})

const reducer = <T extends Item>(state: State<T>, action: ActionType<T>): State<T> => {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return { ...state, showModal: !state.showModal };
        case 'TOGGLE_ALERT_DIALOG':
            return { ...state, showAlertDialog: !state.showAlertDialog };
        case 'SET_SELECTED_ITEM':
            return { ...state, selectedItem: action.payload };
        case 'SET_ITEM_TO_DELETE':
            return { ...state, itemToDelete: action.payload };
        case 'SET_RESPONSE_LIST':
            return { ...state, responseList: action.payload };
        case 'SET_RESPONSE_ITEM':
            return { ...state, responseItem: action.payload };
        case 'SET_DELETE_RESPONSE':
            return { ...state, responseDelete: action.payload };
        case 'RESET_STATE':
            return initialState();
        default:
            return state;
    }
};

export const ItemsPage = <T extends Item>({ title, 
                                                    placeholder, 
                                                    buttonName, 
                                                    fetchItems, 
                                                    createOrUpdateItem, 
                                                    deleteItem,
                                                    searchItem, 
                                                    renderItemForm, 
                                                    renderItemList: ItemList, 
                                                    columns,
                                                    showSearch = true }: ItemsPageProps<T>) => {


    const [ state, dispatch ] = useReducer(reducer, initialState<T>());

    const { items, setAllItems, addItem, updateItem, removeItem, existItem } = useList<T>([]);
    const { loading, callEndPoint } = useFetchAndLoad();

    const fetch = useCallback(async () => {
        const result = await callEndPoint(fetchItems());
        dispatch({ type: 'SET_RESPONSE_LIST', payload: result });
    }, [callEndPoint, fetchItems]);

    const createOrUpdate = useCallback(async (item: T) => {
        const result = await callEndPoint(createOrUpdateItem(item));
        dispatch({ type: 'SET_RESPONSE_ITEM', payload: result });
    }, [callEndPoint, createOrUpdateItem]);

    const search = useCallback(async (query: string) => {
        if(showSearch && searchItem){
            const result = await callEndPoint(searchItem(query));
            dispatch({ type: 'SET_RESPONSE_LIST', payload: result });
        }
    }, [callEndPoint, searchItem, showSearch]);

    const deleteHandler = useCallback(async (itemId: number) => {
        const result = await callEndPoint(deleteItem(itemId));
        dispatch({ type: 'SET_DELETE_RESPONSE', payload: result });
    }, [callEndPoint, deleteItem]);

    useEffect(() => {
        if(!state.responseList.data && !state.responseList.error) fetch();
    }, [fetch, state.responseList]);

    useEffect(() => {
        if(!loading && state.responseList.data && !state.responseList.error){
            console.log(state.responseList.data);
            setAllItems(state.responseList.data as T[]);
        }
    }, [loading, setAllItems, state.responseList]);

    useEffect(() => {
        if(!loading && state.responseDelete.data && !state.responseDelete.error){
            removeItem(state.itemToDelete!);
            dispatch({ type: 'SET_ITEM_TO_DELETE', payload: null });
            dispatch({ type: 'TOGGLE_ALERT_DIALOG' });
            dispatch({ type: 'SET_DELETE_RESPONSE', payload: { data: null, error: null } });
        }
    }, [state.responseDelete, loading, removeItem, state.itemToDelete]);

    useEffect(() => {
        if (!loading && state.responseItem.data && !state.responseItem.error) {
            const { data: item } = state.responseItem;
            if (!existItem(item.id)) addItem(item as T); // Add type assertion here
            else updateItem(item as T);
            dispatch({ type: 'SET_RESPONSE_ITEM', payload: { data: null, error: null } });
            dispatch({ type: 'TOGGLE_MODAL' });
            dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
        }
    }, [addItem, existItem, loading, state.responseItem, updateItem]);

    const handleEditItem = (item: T) => {
        dispatch({ type: 'SET_SELECTED_ITEM', payload: item.id });
        dispatch({ type: 'TOGGLE_MODAL' });
    };

    const handleDeleteItem = (item: T) => {
        dispatch({ type: 'SET_ITEM_TO_DELETE', payload: item.id });
        dispatch({ type: 'TOGGLE_ALERT_DIALOG' });
    };

    const confirmDeleteItem = async () => {
        if (state.itemToDelete) {
            await deleteHandler(state.itemToDelete);
        }
    };

    const handleFormSubmit = async (item: T) => {
        console.log(item);
        // await createOrUpdate(item);
    };

    const handleSearch = useCallback(async (query: string) => {
        if(query) await search(query);
    }, [search]);

    const handleCreateItem = () => {
        dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
        dispatch({ type: 'TOGGLE_MODAL' });
    }

    const itemActions: Action<T>[] = [
        { label: 'Edit', classNameButton: 'btn btn-outline-warning', classNameIcon: 'fas fa-edit', method: handleEditItem },
        { label: 'Delete', classNameButton: 'btn btn-outline-danger', classNameIcon: 'fas fa-trash-alt',method: handleDeleteItem }
    ];

    
    return (
        <>
            <PageHeader title={title} placeholder={placeholder} buttonName={buttonName} onSearch={handleSearch} onCreate={handleCreateItem} showSearch={showSearch}/>
            <div className="container">
                {
                    loading ? <CircularProgress disableShrink /> : !items.length ? <div>Not found data.</div> : (
                        <ReusableTable<T> 
                            data={items}
                            columns={columns}
                            actions={itemActions}
                            BodyComponent={ItemList}
                        />
                    )
                }
            </div>
            {
                state.showModal && (
                    <GenericModal
                        title={state.selectedItem ? `Edit ${title}` : `Create ${title}`}
                        body={renderItemForm(state.selectedItem, handleFormSubmit)}
                        show={state.showModal}
                        onClose={() => dispatch({ type: 'TOGGLE_MODAL' })}
                    />
                )
            }
            {
                state.showAlertDialog && (
                    <AlertDialog
                        open={state.showAlertDialog}
                        onClose={() => dispatch({ type: 'TOGGLE_ALERT_DIALOG' })}
                        onConfirm={confirmDeleteItem}
                        title={`Are you sure you want to delete this ${title?.toLowerCase()}?`}
                    />
                )
            }
        </>
    )
}