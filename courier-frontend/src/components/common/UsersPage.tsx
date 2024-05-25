import { useAuth } from "../../hooks";
import { Client, User, ValueColumn } from "../../types";
import { serviceRequest } from "../../services";
import { paths } from "../../helpers";
import { ItemsPage } from "../shared";
import { UserList } from "../partials";
import { UserForm } from "../modal";


export const UsersPage = () => {

    const { userDetails } = useAuth();

    const fetchUsers = () => serviceRequest.getItem<User[]>(paths.courier.users);

    const createUser = (user: User) => serviceRequest.postItem<User, User>(paths.courier.createOrUpdateUser, user);

    const createClient = (client: Client) => serviceRequest.postItem<Client, Client>(paths.courier.createOrUpdateClient, client);

    const updateUser = (user: User) => serviceRequest.putItem<User, User>(paths.courier.createOrUpdateUser, user);

    const updateClient = (client: Client) => serviceRequest.putItem<Client, Client>(paths.courier.createOrUpdateClient, client);


    const deleteUser = (userId: number) => serviceRequest.deleteItem<string>(`${paths.courier.deleteUser}/${userId}`);
    const searchUser = (query: string) => serviceRequest.getItem<User[]>(`${paths.courier.users}/search?query=${query}`);

    const createOrUpdateItem = (item: User | Client) => {
        if(isClient(item)){
            return item.id ? updateClient(item) : createClient(item);
        }else{
            return item.id ? updateUser(item) : createUser(item);
        }
    }

    const isClient = (item: User | Client): item is Client => {
        return (item as Client).office !== undefined && (item as Client).branches !== undefined;
    };


    const userColumns: ValueColumn[] = [
        { key: 'fullname', label: 'Fullname' },
        { key: 'contactInfo', label: 'Contact Information' },
        ...(userDetails?.roles.some(role => role.name === 'ROLE_ADMIN') ? [{ key: 'roles', label: 'Roles' }] : [])
    ];

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
            />
        </>
    )
}