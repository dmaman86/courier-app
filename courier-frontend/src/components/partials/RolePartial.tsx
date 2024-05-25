import { Role, ValueColumn } from "../../types";
import { serviceRequest } from "../../services";
import { paths } from "../../helpers";
import {  ItemsPage } from "../shared";
import {  RoleForm } from "../modal";
import { RoleList } from "./RoleList";

const rolesColumns: ValueColumn[] = [
    { key: 'role', label: 'Role Name' }
];

export const RolePartial = () => {

    const fetchRoles = () => serviceRequest.getItem<Role[]>(paths.courier.roles);

    const createOrUpdateRole = (role: Role) => role.id ? serviceRequest.putItem<Role>(paths.courier.roles, role) : 
                                    serviceRequest.postItem<Role>(paths.courier.roles, role);

    const deleteRole = (roleId: number) => serviceRequest.deleteItem<string>(`${paths.courier.roles}/id/${roleId}`);

    return (
        <>
            <ItemsPage<Role>
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