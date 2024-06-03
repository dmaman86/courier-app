
import { Client, PageResponse, User, ValueColumn } from "@/types";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";
import { ItemsPage } from "@/components/shared";
import { UserList } from "@/components/listTables";
import { UserForm } from "@/components/modal";
import { useAuth } from "@/hooks";



export const UsersPage = () => {

    const { userDetails } = useAuth();

    const fetchUsers = (page: number, size: number) => serviceRequest.getItem<PageResponse<User[]>>(`${paths.courier.users}?page=${page}&size=${size}`);

    const createUser = (user: User) => serviceRequest.postItem<User, User>(paths.courier.createOrUpdateUser, user);

    const createClient = (client: Client) => serviceRequest.postItem<Client, Client>(paths.courier.createOrUpdateClient, client);

    const updateUser = (user: User) => serviceRequest.putItem<User, User>(paths.courier.createOrUpdateUser, user);

    const updateClient = (client: Client) => serviceRequest.putItem<Client, Client>(paths.courier.createOrUpdateClient, client);


    const deleteUser = (userId: number) => serviceRequest.deleteItem<string>(`${paths.courier.deleteUser}/${userId}`);
    const searchUser = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<User[]>>(`${paths.courier.users}search?query=${query}&page=${page}&size=${size}`);

    const isAdmin = userDetails ? userDetails.roles.some(role => role.name === 'ROLE_ADMIN') : false;

    const userColumns: ValueColumn[] = [
        { key: 'fullname', label: 'Fullname' },
        { key: 'contactInfo', label: 'Contact Information' },
        ...(isAdmin ? [{ key: 'roles', label: 'Roles' }] : [])
    ];


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
            <ItemsPage<User>
                title="Users"
                placeholder="Search user..."
                buttonName="Create User"
                fetchItems={fetchUsers}
                createOrUpdateItem={createOrUpdateItem}
                deleteItem={deleteUser}
                searchItem={searchUser}
                renderItemForm={(userId, onSubmit) => <UserForm userId={userId} onSubmit={onSubmit} />}
                columns={userColumns}
                renderItemList={({ data, actions }) => <UserList data={data} actions={actions} />}
                canCreate={isAdmin}
            />
        </>
    )
}