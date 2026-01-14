import React, { useEffect, useState } from "react";
import { Box, Paper, TablePagination } from "@mui/material";

import { useFetch, useList, useSnackbar } from "@/hooks";
import { BaseEntity, FetchResponse, ItemsContainerProps } from "@/models";
import {
  SnackbarConfirmAction,
  ItemsHeader,
  ItemInlineForm,
  ItemsTable,
} from "@/ui/components";
import { isSelf } from "@/utilities";

export const ItemsContainer = <T extends BaseEntity>({
  auth,
  header,
  actions,
  adapters,
  list,
  allowedActions,
  formatMessage,
  rowExpandable,
  expandContent,
  advancedSearchContent,
}: ItemsContainerProps<T>) => {
  const { items, setAllItems, addItem, updateItem, removeItem, getItemById } =
    useList<T>([]);
  const { success, warning } = useSnackbar();
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalItems: 0,
  });
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const [filters, setFilters] = useState<any>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const { callEndPoint } = useFetch();

  const isValidFilter = (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value !== "";
    return value !== null && value !== undefined;
  };

  const fetchItems = async () => {
    const isQuery = query !== "";
    const isAdvanced = filters && Object.values(filters).some(isValidFilter);

    let response: FetchResponse;

    if (isAdvanced && actions.searchItemsByFilters) {
      response = await callEndPoint(
        actions.searchItemsByFilters(filters, pagination.page, pagination.size),
        (data) => adapters.listAdapter(data, adapters.itemAdapter),
      );
    } else if (isQuery) {
      response = await callEndPoint(
        actions.searchItem(query, pagination.page, pagination.size),
        (data) => adapters.listAdapter(data, adapters.itemAdapter),
      );
    } else {
      response = await callEndPoint(
        actions.getItems(pagination.page, pagination.size),
        (data) => adapters.listAdapter(data, adapters.itemAdapter),
      );
    }
    if (!response.error && response.data && "content" in response.data) {
      setAllItems(response.data.content);
      setPagination((prev) => ({
        ...prev,
        totalItems: response.data.totalElements,
      }));
    }
  };

  useEffect(() => {
    fetchItems();
  }, [pagination.page, pagination.size, query, filters]);

  const handleCreate = () => {
    setSelectedId(null);
    setDisplayForm(true);
  };

  const handleEdit = (id: string | number) => {
    setSelectedId(id);
    setDisplayForm(true);
  };

  const handleDelete = async (id: string | number) => {
    const item = getItemById(id);
    if (!item) return;

    warning(formatMessage(item), (key) =>
      SnackbarConfirmAction(key, async () => {
        await callEndPoint(actions.deleteItem(id));
        removeItem(id);
        success("Item deleted successfully");
      }),
    );
  };

  const handleClose = () => {
    setSelectedId(null);
    setDisplayForm(false);
  };

  const toggleAdvancedSearch = (expanded?: boolean) => {
    setIsAdvancedOpen((prev) => expanded ?? !prev);
  };

  const handleFormSubmit = async (item: any) => {
    const res = selectedId
      ? await callEndPoint(actions.updateItem(selectedId, item))
      : await callEndPoint(actions.createItem(item));

    if (!res.error && res.data) {
      if (selectedId) updateItem(adapters.itemAdapter(res.data));
      else addItem(adapters.itemAdapter(res.data));
    }
    setSelectedId(null);
    setDisplayForm(false);
  };

  const onPageChange = (_: any, newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination({
      page: 0,
      size: newSize,
      totalItems: pagination.totalItems,
    });
  };

  const validAllowedActions = (actions: string[]) => {
    return actions.some((role) => auth.roles.some((r) => r.name === role));
  };

  const canCreate = validAllowedActions(allowedActions.create);

  const displayActions =
    validAllowedActions(allowedActions.update) ||
    validAllowedActions(allowedActions.delete);

  const canDelete = (item: T) => !isSelf(item, auth);

  const handleRowClick = (item: T) => {
    if (!isExpandable(item)) return;

    setSelectedId(selectedId === item.id! ? null : item.id!);
    setDisplayForm(false);
  };

  const isExpandable = (item: T) => {
    return rowExpandable ? rowExpandable(item) : false;
  };

  const isOpen = (id: string | number) => {
    return selectedId === id;
  };

  return (
    <>
      <Box component={Paper} sx={{ padding: 2, mb: 2 }}>
        <ItemsHeader
          title={header.title}
          placeholder={header.placeholder}
          buttonName={header.buttonName}
          setQuery={setQuery}
          canCreate={canCreate}
          onCreate={handleCreate}
          advancedOptions={
            advancedSearchContent
              ? {
                  onChange: setFilters,
                  isAdvancedSearch: isAdvancedOpen,
                  toggleAdvancedSearch: toggleAdvancedSearch,
                  advancedSearchContent: advancedSearchContent,
                }
              : undefined
          }
        />

        {selectedId === null && displayForm && (
          <div className="row mt-3">
            <ItemInlineForm
              id={null}
              itemForm={list.itemForm}
              onClose={handleClose}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
        <div className="row align-items-center">
          <ItemsTable
            items={items}
            columns={list.columns}
            mapItemRow={list.mapItemRow}
            actions={{
              display: displayActions,
              onEdit: handleEdit,
              onDelete: handleDelete,
              canDelete: canDelete,
            }}
            expansion={{
              isExpandable: isExpandable,
              isOpen: isOpen,
              expandContent: expandContent,
              onRowClick: handleRowClick,
              displayForm: displayForm,
            }}
            formInline={{
              id: selectedId,
              itemForm: list.itemForm,
              onClose: handleClose,
              onSubmit: handleFormSubmit,
            }}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.totalItems}
            rowsPerPage={pagination.size}
            page={pagination.page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </div>
      </Box>
    </>
  );
};
