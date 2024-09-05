
import { Client, PageResponse, User, ValueColumn } from "@/domain";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { ItemsPage, UserForm, UserList } from "@/ui";



export const UsersPage = () => {

    const { userDetails } = useAuth();

    const fetchUsers = (page: number, size: number) => serviceRequest.getItem<PageResponse<User[]>>(`${paths.courier.users}?page=${page}&size=${size}`);

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
        if(isClient(item)){
            return item.id ? updateClient(item) : createClient(item);
        }else{
            const userItem: User = { ...item };
            delete (userItem as Partial<Client>).office;
            delete (userItem as Partial<Client>).branches;

            return userItem.id ? updateUser(userItem) : createUser(userItem);
        }
    }

    const isClient = (item: User | Client): item is Client => {
        
        return item.roles.some(role => role.name === 'ROLE_CLIENT') && 
                (item as Client).office !== undefined && (item as Client).branches !== undefined;
    };

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<User>
                        userDetails={userDetails}
                        title="Users"
                        placeholder="Search user..."
                        buttonName="Create User"
                        fetchItems={fetchUsers}
                        createOrUpdateItem={createOrUpdateItem}
                        deleteItem={deleteUser}
                        searchItem={searchUser}
                        renderItemForm={(userId, onSubmit) => <UserForm userId={userId} onSubmit={onSubmit} />}
                        columns={userColumns}
                        renderItemList={({ data, actions }) => <UserList data={data} actions={actions}/>}
                        allowedRoles={userAllowedRoles}
                    />
                )
            }
        </>
    )
}