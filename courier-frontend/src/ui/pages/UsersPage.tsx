import { useEffect, useState } from "react";

import { Client, PageResponse, User, ValueColumn } from "@/domain";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";
import { useAuth } from "@/hooks";
import { ItemsPage, UserForm, UserList } from "@/ui";



export const UsersPage = () => {

    const { userDetails } = useAuth();

    /*const initialUser: User | Client = {
        id: 0,
        email: '',
        name: '',
        lastName: '',
        phone: '',
        roles: [],
        office: { id: 0, name: ''},
        // office: null,
        branches: [],
        isActive: true
    };*/

    const initialUser: User = {
        id: 0,
        email: '',
        name: '',
        lastName: '',
        phone: '',
        roles: [],
        office: { id: 0, name: ''},
        branches: [],
        isActive: true
    };

    const getUsers = (page: number, size: number) => serviceRequest.getItem<PageResponse<User[]>>(`${paths.courier.users}?page=${page}&size=${size}`);

    const createUser = (user: User) => serviceRequest.postItem<User, User>(paths.courier.createOrUpdateUser, user);

    const createClient = (client: Client) => serviceRequest.postItem<Client, Client>(paths.courier.createOrUpdateClient, client);

    const updateUser = (user: User) => serviceRequest.putItem<User, User>(paths.courier.createOrUpdateUser, user);

    const updateClient = (client: Client) => serviceRequest.putItem<Client, Client>(paths.courier.createOrUpdateClient, client);


    const deleteUser = (userId: number) => serviceRequest.deleteItem<string>(`${paths.courier.deleteUser}/${userId}`);
    const searchUser = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<User[]>>(`${paths.courier.users}search?query=${query}&page=${page}&size=${size}`);

    const [ userColumns, setUserColumns ] = useState<ValueColumn[]>([
        { key: 'fullname', label: 'Fullname' },
        { key: 'contactInfo', label: 'Contact Information' }
    ]);

    const userAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    useEffect(() => {
        if(userDetails && userDetails.roles.some(role => userAllowedRoles.update.includes(role.name) || userAllowedRoles.delete.includes(role.name)))
            setUserColumns([...userColumns, { key: 'roles', label: 'Roles' }, { key: 'actions', label: '' }]);
    }, [userDetails]);


    const createOrUpdateItem = (item: User | Client) => {
        console.log(item);
        const user: User | Client = isClient(item) ? item : (({ office, branches, ...rest }) => rest)(item);
        console.log(user);
        if(user.id === 0){
            return isClient(item) ? createClient(item) : createUser(item);
        }
        return isClient(item) ? updateClient(item) : updateUser(item);
    }

    const isClient = (item: User | Client): item is Client => {
        
        return item.roles.some(role => role.name === 'ROLE_CLIENT') && 
                (item as Client).office !== undefined && (item as Client).branches !== undefined;
    };

    const formatMessage = (user: User) => {
        return `Are you sure you want to delete: 
                Fullname: ${user.name} ${user.lastName},
                Email: ${user.email},
                Phone: ${user.phone}`;
    }

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<User>
                        userDetails={userDetails}
                        header={{ title: 'Users', placeholder: 'Search user...', buttonName: 'Create User' }}
                        getItems={getUsers}
                        actions={{
                            createOrUpdateItem,
                            deleteItem: deleteUser,
                            searchItem: searchUser
                        }}
                        list={{
                            columns: userColumns,
                            itemList: (data, actions) => <UserList data={data} actions={actions}/>,
                            itemForm: (item, onSubmit) => <UserForm item={item} onSubmit={onSubmit} />
                        }}
                        options={{
                            allowedRoles: userAllowedRoles
                        }}
                        initialItem={initialUser}
                        formatMessage={formatMessage}
                    />
                )
            }
        </>
    )
}