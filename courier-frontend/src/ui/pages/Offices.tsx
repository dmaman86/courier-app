import { useState } from "react";

import { resourceAdapter } from "@/adapters";
import { useAuth } from "@/hooks";
import { Branch, PageProps, ValueColumn } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import {
  BranchForm,
  BranchSearchContent,
  ItemsContainer,
} from "@/ui/components";

export const Offices = ({ allowedActions }: PageProps) => {
  const { auth } = useAuth();

  const defaultActions = { create: [], update: [], delete: [] };
  allowedActions = allowedActions || defaultActions;

  const getBranches = (page: number, size: number) => {
    return serviceRequest.getItem(
      `${urlPaths.branch.base}?page=${page}&size=${size}`,
    );
  };

  const createBranch = (item: any) => {
    const branch = resourceAdapter.branchAdapter(item);
    return serviceRequest.postItem(urlPaths.branch.base, branch);
  };

  const updateBranch = (id: string | number, item: any) => {
    const branch = resourceAdapter.branchAdapter(item);
    return serviceRequest.putItem(`${urlPaths.branch.base}/${id}`, branch);
  };

  const deleteBranch = (id: string | number) =>
    serviceRequest.deleteItem(`${urlPaths.branch.base}/${id}`);

  const searchBranch = (query: string, page: number, size: number) =>
    serviceRequest.getItem(
      `${urlPaths.branch.search}?query=${query}&page=${page}&size=${size}`,
    );

  const searchBranchByFilter = (filters: any, page: number, size: number) => {
    const branchFilters = resourceAdapter.branchAdvancedAdapter(filters);
    return serviceRequest.postItem(
      `${urlPaths.branch.search}/advanced?page=${page}&size=${size}`,
      branchFilters,
    );
  };

  const [branchColumns, setBranchColumns] = useState<ValueColumn<Branch>[]>([
    {
      key: "officeName",
      label: "Office Name",
      sortable: true,
      sortedValue: (branch) => branch.office.name.toLowerCase(),
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      sortedValue: (branch) => branch.city.toLowerCase(),
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
      sortedValue: (branch) => branch.address.toLowerCase(),
    },
  ]);

  const mapBranchInfo = (branch: Branch) => [
    { key: "officeName", content: `${branch.office.name}` },
    { key: "city", content: `${branch.city}` },
    { key: "address", content: `${branch.address}` },
  ];

  const formatBranchMessage = (branch: Branch) => {
    return `Are you sure you want to delete:
                Branch City: ${branch.city}
                Branch Address: ${branch.address}`;
  };

  return (
    <>
      <div style={{ marginTop: "3rem" }}>
        <ItemsContainer<Branch>
          auth={auth}
          header={{
            title: "Offices & Branches",
            placeholder: "Search branches...",
            buttonName: "Create Branch",
          }}
          actions={{
            getItems: getBranches,
            createItem: createBranch,
            updateItem: updateBranch,
            deleteItem: deleteBranch,
            searchItem: searchBranch,
            searchItemsByFilters: searchBranchByFilter,
          }}
          adapters={{
            itemAdapter: resourceAdapter.branchAdapter,
            listAdapter: resourceAdapter.listAdapter,
          }}
          list={{
            columns: branchColumns,
            mapItemRow: mapBranchInfo,
            itemForm: (id, onSubmit, onClose) => (
              <BranchForm id={id} onSubmit={onSubmit} onClose={onClose} />
            ),
          }}
          allowedActions={allowedActions}
          formatMessage={formatBranchMessage}
          advancedSearchContent={(onChange, isOpen) => (
            <BranchSearchContent onChange={onChange} isOpen={isOpen} />
          )}
        />
      </div>
    </>
  );
};
