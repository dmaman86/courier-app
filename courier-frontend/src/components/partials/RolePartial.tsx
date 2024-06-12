import { PageResponse, Role, ValueColumn } from "@/types";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";
import {  ItemsPage } from "@/components/shared";
import {  RoleForm } from "@/components/modal";
import { RoleList } from "@/components/listTables";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";

export const RolePartial = () => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const fetchRoles = (page: number, size: number) => serviceRequest.getItem<PageResponse<Role[]>>(`${paths.courier.roles}?page=${page}&size=${size}`);

    const createOrUpdateRole = (role: Role) => role.id ? serviceRequest.putItem<Role>(paths.courier.roles, role) : 
                                    serviceRequest.postItem<Role>(paths.courier.roles, role);

    const deleteRole = (roleId: number) => serviceRequest.deleteItem<string>(`${paths.courier.roles}id/${roleId}`);

    const [ roleColumns, setRoleColumns ] = useState<ValueColumn[]>([
        { key: 'role', label: 'Role Name' }
    ]);

    useEffect(() => {
        if(userDetails && userDetails.roles.some(role => role.name === 'ROLE_ADMIN')){
            setRoleColumns([...roleColumns, { key: 'actions', label: '' }]);
        }
    }, [userDetails]);

    const roleAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    return (
        <>
            {
                userDetails && (
                    <ItemsPage<Role>
                        userDetails={userDetails}
                        title="Roles"
                        placeholder="Search role..."
                        buttonName="Create Role"
                        fetchItems={fetchRoles}
                        createOrUpdateItem={createOrUpdateRole}
                        deleteItem={deleteRole}
                        renderItemForm={(roleId, onSubmit) => <RoleForm roleId={roleId} onSubmit={onSubmit} />}
                        columns={roleColumns}
                        renderItemList={({ data, actions }) => <RoleList data={data} actions={actions} />}
                        showSearch={false}
                        allowedRoles={roleAllowedRoles}
                    />
                )
            }
        </>
    );
}