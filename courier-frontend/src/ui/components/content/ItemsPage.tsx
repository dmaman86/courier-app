import { useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Typography } from "@mui/material";

import { Action, FetchResponse, Item, ItemsPageProps, PageResponse } from "@/domain";
import { useAsync, useFetchAndLoad, useList } from "@/hooks";
import { withLoading } from "@/hoc";
import { CustomDialog, PageHeader, ReusableTable } from "@/ui";
import { useUserItemActions, useItemsPage } from "@/useCases";

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


    const fetchData = async (): Promise<FetchResponse<PageResponse<T[]>>> => {
        if(actions.searchItem && state.searchQuery){
            return await callEndPoint(actions.searchItem(state.searchQuery, state.pagination.page, state.pagination.size));
        }
        return await callEndPoint(getItems(state.pagination.page, state.pagination.size));
    }

    const handleApiResponse = (response: FetchResponse<PageResponse<T[]>>) => {
        if(response.data && !response.error){
            const { data } = response;
            setAllItems(data.content);
            setPagination(data.pageable.pageNumber, state.pagination.size, data.totalElements);
        }else{
            showBoundary(response.error);
        }
    }

    useAsync(fetchData, handleApiResponse, () => {}, [state.searchQuery, state.pagination.page, state.pagination.size]);

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

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query || '');
    }, [setSearchQuery]);

    const handleCreateItem = () => {
        setSelectedItem(initialItem);
        setDisplayCreateItem(true);
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setPagination(0, newSize, state.pagination.totalItems);
    }

    const handlePageChange = (event: unknown, page: number) => {
        setPagination(page, state.pagination.size, state.pagination.totalItems);
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
                    // BodyComponent={() => list.itemList(items, actionsItem)}
                    renderItemColumns={(item: { id: number; }) => list.renderItemColumns(item as T)}
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