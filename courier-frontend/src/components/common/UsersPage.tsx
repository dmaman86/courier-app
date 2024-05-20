import { useAuth } from "../../hooks";
import { User, ValueColumn } from "../../types";
import { serviceRequest } from "../../services";
import { paths } from "../../helpers";
import { ItemsPage } from "../shared";
import { UserList } from "../partials";
import { UserForm } from "../modal";


export const UsersPage = () => {

    const { userDetails } = useAuth();

    const fetchUsers = () => serviceRequest.getItem<User[]>(paths.courier.users);
    const createOrUpdateUser = (user: User) => user.id ? serviceRequest.putItem<User, User>(paths.courier.createOrUpdateUser, user) :
                                                            serviceRequest.postItem<User, User>(paths.courier.createOrUpdateUser, user);
    const deleteUser = (userId: number) => serviceRequest.deleteItem<string>(`${paths.courier.deleteUser}/${userId}`);
    const searchUser = (query: string) => serviceRequest.getItem<User[]>(`${paths.courier.users}/search?query=${query}`);


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
                createOrUpdateItem={createOrUpdateUser}
                deleteItem={deleteUser}
                searchItem={searchUser}
                renderItemForm={(user, onSubmit) => <UserForm user={user} onSubmit={onSubmit} />}
                columns={userColumns}
                renderItemList={({ data, actions }) => <UserList data={data} actions={actions} />}
            />
        </>
    )
}