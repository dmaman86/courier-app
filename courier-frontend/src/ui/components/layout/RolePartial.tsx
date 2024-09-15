import { PageResponse, Role, ValueColumn } from "@/domain";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { ItemsPage, RoleForm, RoleList } from "@/ui";

export const RolePartial = () => {

    const { userDetails } = useAuth();

    const initialRole: Role = {
        id: 0,
        name: ''
    };

    const getRoles = (page: number, size: number) => serviceRequest.getItem<PageResponse<Role[]>>(`${paths.courier.roles}?page=${page}&size=${size}`);

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

    const formatMessage = (role: Role) => {
        return `Are you sure you want to delete:
                Role: ${role.name}`
    }

    return (
        <>
            {
                userDetails && (
                    <ItemsPage<Role>
                        userDetails={userDetails}
                        header={{
                            title: 'Roles',
                            placeholder: 'Search role...',
                            buttonName: 'Create Role'
                        }}
                        getItems={getRoles}
                        actions={{
                            createOrUpdateItem: createOrUpdateRole,
                            deleteItem: deleteRole,
                        }}
                        list={{
                            columns: roleColumns,
                            itemList: (data, actions) => <RoleList data={data} actions={actions}/>,
                            itemForm: (item, onSubmit, onClose) => <RoleForm item={item} onSubmit={onSubmit} onClose={onClose}/>
                        }}
                        options={{
                            showSearch: false,
                            allowedRoles: roleAllowedRoles
                        }}
                        initialItem={initialRole}
                        formatMessage={formatMessage}
                    />
                )
            }
        </>
    );
}