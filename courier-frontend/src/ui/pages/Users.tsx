import { useState } from "react";

import { useAuth } from "@/hooks";
import { PageProps, Role, ROLES, User, ValueColumn } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { userAdapter } from "@/adapters";
import {
  ClientDetails,
  ItemsContainer,
  UserForm,
  UserSearchContent,
} from "@/ui/components";

export const Users = ({ allowedActions }: PageProps) => {
  const { auth } = useAuth();

  const defaultActions = { create: [], update: [], delete: [] };
  allowedActions = allowedActions || defaultActions;

  const getUsers = (page: number, size: number) =>
    serviceRequest.getItem(`${urlPaths.user.base}?page=${page}&size=${size}`);

  const createUser = (item: any) => {
    const isClient = item.roles.some((role) => role.name === ROLES.CLIENT);
    const user = isClient
      ? userAdapter.clientAdapter(item)
      : userAdapter.userAdapter(item);

    return serviceRequest.postItem(urlPaths.user.base, user);
  };

  const updateUser = (id: string | number, item: any) => {
    const isClient = item.roles.some(
      (role: Role) => role.name === ROLES.CLIENT,
    );
    const user = isClient
      ? userAdapter.clientAdapter(item)
      : userAdapter.userAdapter(item);
    return serviceRequest.putItem(`${urlPaths.user.base}/${id}`, user);
  };

  const deleteUser = (id: string | number) =>
    serviceRequest.deleteItem(`${urlPaths.user.base}/${id}`);

  const searchUser = (query: string, page: number, size: number) =>
    serviceRequest.getItem(
      `${urlPaths.user.search}?query=${query}&page=${page}&size=${size}`,
    );

  const searchUsersByFilters = (filters: any, page: number, size: number) => {
    const userFilter = userAdapter.userAdvancesSearchAdapter(filters);
    return serviceRequest.postItem(
      `${urlPaths.user.base}/advanced-search?page=${page}&size=${size}`,
      userFilter,
    );
  };

  const [userColumns, setUserColumns] = useState<ValueColumn<User>[]>([
    {
      key: "fullname",
      label: "Full Name",
      sortable: true,
      sortedValue: (user) => user.fullName.toLowerCase(),
    },
    { key: "contactInfo", label: "Contact Info" },
    { key: "roles", label: "Roles" },
  ]);

  const formattedUserRoles = (roles: Role[]) => {
    const formatted = roles.map((role) => role.name.replace(/^ROLE_/, ""));
    return `[${formatted.join(", ")}]`;
  };

  const mapUserInfo = (user: User) => [
    { key: "fullname", content: `${user.fullName}` },
    {
      key: "contactInfo",
      content: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{user.email}</span>
          <span>{user.phoneNumber}</span>
        </div>
      ),
    },
    { key: "roles", content: formattedUserRoles(user.roles) },
  ];

  const formatMessage = (user: User) => {
    return `Are you sure you want to delete: ${user.fullName}?`;
  };

  return (
    <>
      <ItemsContainer<User>
        auth={auth}
        header={{
          title: "Users",
          placeholder: "Search users...",
          buttonName: "Create User",
        }}
        actions={{
          getItems: getUsers,
          createItem: createUser,
          updateItem: updateUser,
          deleteItem: deleteUser,
          searchItem: searchUser,
          searchItemsByFilters: searchUsersByFilters,
        }}
        adapters={{
          itemAdapter: userAdapter.userAdapter,
          listAdapter: userAdapter.listAdapter,
        }}
        list={{
          columns: userColumns,
          mapItemRow: mapUserInfo,
          itemForm: (id, onSubmit, onClose) => (
            <UserForm id={id} onSubmit={onSubmit} onClose={onClose} />
          ),
        }}
        allowedActions={allowedActions}
        formatMessage={formatMessage}
        rowExpandable={(user) =>
          user.roles.some((role) => role.name === ROLES.CLIENT)
        }
        expandContent={(id) => <ClientDetails id={id} />}
        advancedSearchContent={(onChange, isOpen) => (
          <UserSearchContent onChange={onChange} isOpen={isOpen} />
        )}
      />
    </>
  );
};
