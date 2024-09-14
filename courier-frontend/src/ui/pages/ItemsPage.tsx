import { useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Typography } from "@mui/material";

import { Action, FetchResponse, Item, ItemsPageProps, PageResponse } from "@/domain";
import { useAsync, useFetchAndLoad, useItemsPage, useList } from "@/hooks";
import { withLoading } from "@/hoc";
import { CustomDialog, PageHeader, ReusableTable } from "@/ui";
import { useUserItemActions } from "@/useCases";





export const ItemsPage = <T extends Item>({ 
    userDetails,
    header,
    getItems,
    actions,
    list,
    options,
    initialItem,
    formatMessage }: ItemsPageProps<T>) => {


    const ReusableTableWithLoading = withLoading(ReusableTable);

    const { state,
        toggleModal,
        toggleAlertDialog,
        setSelectedItem,
        setPagination,
        setSearchQuery,
        setResponseItem,
        setDeleteResponse } = useItemsPage<T>(initialItem);

    const [ displayCreateItem, setDisplayCreateItem ] = useState<boolean>(false);
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState<React.ReactNode>(null);
    const [ actionsForm, setActionsForm ] = useState<React.ReactNode>(null);

    const { items, setAllItems, addItem, updateItem, removeItem, existItem } = useList<T>([]);
    const { loading, callEndPoint } = useFetchAndLoad();
    const { showBoundary } = useErrorBoundary();

    const getApiData = async() => await callEndPoint(getItems(state.pagination.page, state.pagination.size));

    const handleSuccess = (response: FetchResponse<PageResponse<T[]>>) => {
        console.log(response);
        if(response.data && response.data.content.length && !response.error){
            const { data } = response;
            console.log(response.data);
            setAllItems(data.content);
            setPagination(data.pageable.pageNumber, state.pagination.size, data.totalElements);
        }else{
            showBoundary(response.error);
        }

    }

    useAsync(getApiData, handleSuccess, () => {}, [state.pagination.page, state.pagination.size] )

    const searchApiData = async (): Promise<FetchResponse<PageResponse<T[]>>> => {
        if (actions.searchItem && state.searchQuery) {
            return await callEndPoint(actions.searchItem(state.searchQuery, state.pagination.page, state.pagination.size));
        }
        return { data: null, error: null };
    };

    const handleSearchSuccess = (response: FetchResponse<PageResponse<T[]>>) => {
        if(state.searchQuery){
            if(response.data && !response.error){
                const { data } = response;
                setAllItems(data.content);
                setPagination(data.pageable.pageNumber, state.pagination.size, data.totalElements);
            }else{
                showBoundary(response.error);
            }
        }
    }
    
    useAsync(searchApiData, handleSearchSuccess, () => {}, [state.searchQuery, state.pagination.page, state.pagination.size])

    const createOrUpdate = useCallback(async (item: T) => {
        const result = await callEndPoint(actions.createOrUpdateItem(item));
        setResponseItem(result);
    }, [callEndPoint, actions.createOrUpdateItem, setResponseItem]);

    const deleteHandler = useCallback(async (itemId: number) => {
        const result = await callEndPoint(actions.deleteItem(itemId));
        setDeleteResponse(result);
    }, [callEndPoint, actions.deleteItem, setDeleteResponse]);

    useEffect(() => {
        if(!loading && state.responseItem.data && !state.responseItem.error){
            const { data: item } = state.responseItem;
            if (!existItem(item as T)) addItem(item as T); // Add type assertion here
            else updateItem(item as T);
            setResponseItem({ data: null, error: null });
            toggleModal();
            setSelectedItem(initialItem);
        }
    }, [addItem, existItem, loading, state.responseItem, updateItem]);

    useEffect(() => {
        if(!loading && state.responseDelete.data && !state.responseDelete.error){
            removeItem(state.selectedItem as T);
            setSelectedItem(initialItem);
            toggleAlertDialog();
            setDeleteResponse({ data: null, error: null });
        }
    }, [state.responseDelete, state.selectedItem, loading, removeItem]);

    const handleSearch = useCallback(async (query: string) => {
        if(query){
            setSearchQuery(query);
            await searchApiData();
        }
    }, [setSearchQuery, searchApiData]);

    const handleCreateItem = () => {
        setSelectedItem(initialItem);
        setDisplayCreateItem(true);
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setPagination(0, newSize, state.pagination.totalItems);
        if(state.searchQuery) searchApiData();
        else getApiData();
    }

    const handlePageChange = (event: unknown, page: number) => {
        setPagination(page, state.pagination.size, state.pagination.totalItems);
        if(state.searchQuery) searchApiData();
        else getApiData();
    }

    const handleClose = () => {
        setTitle('');
        setContent(null);
        setActionsForm(null);
        toggleAlertDialog();
    }

    const handleEditItem = (item: T) => {
        setSelectedItem(item);
        setTitle(`Edit item ID: ${item.id}`);
        setContent(list.itemForm(item, handleFormSubmit, handleClose));
        // toggleModal();
        toggleAlertDialog();
    };

    const handleDeleteItem = (item: T) => {
        setSelectedItem(item);
        setTitle(`Delete item ID: ${item.id}`);
        setContent(<Typography style={{ whiteSpace: 'pre-line' }}>{formatMessage(item)}</Typography>);
        setActionsForm(<>
            <button onClick={handleClose} className="btn btn-secondary">Cancel</button>
            <button onClick={() => deleteHandler(item.id)} className="btn btn-danger">Sure</button>
        </>);
        toggleAlertDialog();
    };

    const { userHasRole, actionsItem } = useUserItemActions<T>(userDetails, options.allowedRoles, handleEditItem, handleDeleteItem);
    
    const handleFormSubmit = async (item: T) => {
        await createOrUpdate(item);
    };
    
    return (
        <>
            <PageHeader header={header} 
                        onCreate={handleCreateItem} 
                        search={{
                            onSearch: handleSearch,
                            showSearch: options.showSearch ?? true,
                            canCreate: userHasRole(options.allowedRoles.create),
                            query: state.searchQuery
                            
                        }}
                        />
            {
                    displayCreateItem && (
                        <div className="container">
                            <div className="card">
                                <div className="card-body">
                                    {state.selectedItem && list.itemForm(state.selectedItem as T, handleFormSubmit)}
                                </div>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" onClick={() => setDisplayCreateItem(false)}>
                                    <i className="fas fa-times"></i>
                                </span>
                            </div>
                        </div>
                    )
            }
            <div className="container pt-3">
                <ReusableTableWithLoading 
                    isLoading={loading}
                    data={items}
                    columns={list.columns}
                    actions={actionsItem as Action<{ id: number; }>[]}
                    BodyComponent={() => list.itemList(items, actionsItem)}
                    pagination={state.pagination}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </div>
            <CustomDialog 
                open={state.showAlertDialog} 
                onClose={handleClose} 
                title={title}
                content={content}
                actions={actionsForm}
            />
        </>
    )
}