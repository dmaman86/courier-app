import { useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";


import { Action, FetchResponse, Item, ItemsPageProps, PageResponse } from "@/domain";
import { useAsync, useFetchAndLoad, useItemsPage, useList } from "@/hooks";
import { withLoading } from "@/hoc";
import { AlertDialog, GenericModal, PageHeader, ReusableTable } from "@/ui";
import { useUserItemActions } from "@/useCases";





export const ItemsPage = <T extends Item>({         userDetails,
                                                    title, 
                                                    placeholder, 
                                                    buttonName, 
                                                    fetchItems, 
                                                    createOrUpdateItem, 
                                                    deleteItem,
                                                    searchItem, 
                                                    renderItemForm, 
                                                    renderItemList: ItemList, 
                                                    columns,
                                                    showSearch = true,
                                                    allowedRoles }: ItemsPageProps<T>) => {


    const ReusableTableWithLoading = withLoading(ReusableTable);

    const { state,
        toggleModal,
        toggleAlertDialog,
        setSelectedItem,
        setPagination,
        setSearchQuery,
        setResponseItem,
        setDeleteResponse } = useItemsPage<T>();

    const [ displayCreateItem, setDisplayCreateItem ] = useState<boolean>(false);

    const { items, setAllItems, addItem, updateItem, removeItem, existItem } = useList<T>([]);
    const { loading, callEndPoint } = useFetchAndLoad();
    const { showBoundary } = useErrorBoundary();

    const getApiData = async() => await callEndPoint(fetchItems(state.pagination.page, state.pagination.size));

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
        if (searchItem && state.searchQuery) {
            return await callEndPoint(searchItem(state.searchQuery, state.pagination.page, state.pagination.size));
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
        const result = await callEndPoint(createOrUpdateItem(item));
        setResponseItem(result);
    }, [callEndPoint, createOrUpdateItem, setResponseItem]);

    const deleteHandler = useCallback(async (itemId: number) => {
        const result = await callEndPoint(deleteItem(itemId));
        setDeleteResponse(result);
    }, [callEndPoint, deleteItem, setDeleteResponse]);

    useEffect(() => {
        if(!loading && state.responseItem.data && !state.responseItem.error){
            const { data: item } = state.responseItem;
            if (!existItem(item as T)) addItem(item as T); // Add type assertion here
            else updateItem(item as T);
            setResponseItem({ data: null, error: null });
            toggleModal();
            setSelectedItem(null);
        }
    }, [addItem, existItem, loading, state.responseItem, updateItem]);

    useEffect(() => {
        if(!loading && state.responseDelete.data && !state.responseDelete.error){
            removeItem(state.selectedItem as T);
            setSelectedItem(null);
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
        setSelectedItem(null);
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

    const handleEditItem = (item: T) => {
        setSelectedItem(item);
        toggleModal();
    };

    const handleDeleteItem = (item: T) => {
        setSelectedItem(item);
        toggleAlertDialog();
    };

    const { userHasRole, actions } = useUserItemActions<T>(userDetails, allowedRoles, handleEditItem, handleDeleteItem);
    
    const handleFormSubmit = async (item: T) => {
        await createOrUpdate(item);
    };
    
    return (
        <>
            <PageHeader title={title} placeholder={placeholder} buttonName={buttonName} onSearch={handleSearch} 
                            onCreate={handleCreateItem} showSearch={showSearch} canCreate={userHasRole(allowedRoles.create)}/>
            {
                    displayCreateItem && (
                        <div className="container">
                            <div className="card">
                                <div className="card-body">
                                    {renderItemForm(null, handleFormSubmit)}
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
                    columns={columns}
                    actions={actions as Action<{ id: number; }>[]}
                    BodyComponent={ItemList as React.ComponentType<{ data: { id: number; }[]; actions?: Action<{ id: number; }>[] | undefined; }>}
                    pagination={state.pagination}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </div>
            {
                state.showModal && (
                    <GenericModal
                        title={state.selectedItem ? `Edit ${title}` : `Create ${title}`}
                        body={renderItemForm(state.selectedItem?.id!, handleFormSubmit)}
                        show={state.showModal}
                        onClose={toggleModal}
                    />
                )
            }
            <AlertDialog
                        open={state.showAlertDialog}
                        onClose={toggleAlertDialog}
                        onConfirm={() => deleteHandler(state.selectedItem?.id!)}
                        title={`Are you sure you want to delete this ${title?.toLowerCase()}?`}
                    />
        </>
    )
}