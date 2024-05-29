import { PageRespost, Role, ValueColumn } from "../../types";
import { serviceRequest } from "../../services";
import { paths } from "../../helpers";
import {  ItemsPage } from "../shared";
import {  RoleForm } from "../modal";
import { RoleList } from "../listTables/RoleList";

const rolesColumns: ValueColumn[] = [
    { key: 'role', label: 'Role Name' }
];

export const RolePartial = () => {

    const fetchRoles = (page: number, size: number) => serviceRequest.getItem<PageRespost<Role[]>>(`${paths.courier.roles}?page=${page}&size=${size}`);

    const createOrUpdateRole = (role: Role) => role.id ? serviceRequest.putItem<Role>(paths.courier.roles, role) : 
                                    serviceRequest.postItem<Role>(paths.courier.roles, role);

    const deleteRole = (roleId: number) => serviceRequest.deleteItem<string>(`${paths.courier.roles}id/${roleId}`);

    return (
        <>
            <ItemsPage<Role>
                title="Roles"
                placeholder="Search role..."
                buttonName="Create Role"
                fetchItems={fetchRoles}
                createOrUpdateItem={createOrUpdateRole}
                deleteItem={deleteRole}
                renderItemForm={(roleId, onSubmit) => <RoleForm roleId={roleId} onSubmit={onSubmit} />}
                columns={rolesColumns}
                renderItemList={({ data, actions }) => <RoleList data={data} actions={actions} />}
                showSearch={false}
            />
        </>
    );
}