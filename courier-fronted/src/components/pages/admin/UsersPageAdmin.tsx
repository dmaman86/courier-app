import { useState, useEffect } from "react";
import { Action, FetchResponse, User, ValueColumn } from "../../../types";
import { useAuth, useFetchAndLoad, useList } from "../../../hooks";
import { serviceRequest } from "../../../services";
import { paths } from "../../../helpers";
import { PageHeader, ReusableTable } from "../../shared";
import { UserList } from "../../partials/UserList";
import { GenericModal, UserForm } from "../../modal";

const extractRoleNames = (user: User) => {
    const formattedRoles = user.roles.map((role) => {
        return role.name.replace(/^ROLE_/, '');
    });
    return `[${formattedRoles.join(', ')}]`;
}

const userColumns: ValueColumn<User>[] = [
    {
        key: 'fullname',
        label: 'Fullname',
        render: (item: User) => `${item.name} ${item.lastName}`
    },
    {
        key: 'contactInfo',
        label: 'Contact Information',
        render: (item: User) => `${item.email} ${item.phone}`
    },
    {
        key: 'roles',
        label: 'Roles',
        render: (item: User) => extractRoleNames(item)
    }
];


export const UsersPageAdmin = () => {

    const { userDetails } = useAuth();
    const [ showModal, setShowModal ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState<User | null>(null);
    const { items, setAllItems, addItem, updateItem, removeItem } = useList<User>([]);
    const [ response, setResponse ] = useState<FetchResponse<User[]>>({
        data: null,
        error: null
    });

    const { loading, callEndPoint } = useFetchAndLoad();

    const { data, error } = response;

    const toogleModal = () => setShowModal(!showModal);

    useEffect(() => {
        if(!loading && data) setAllItems(data);
    }, [data, loading, setAllItems]);


    useEffect(() => {

        let isMounted = true;

        const fetchData = async () => {
            if(userDetails){
                const result = await callEndPoint(serviceRequest.getItem<User[]>(paths.courier.users))
                if(isMounted) setResponse(result);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        }
        
    }, [userDetails]);


    useEffect(() => {
        if(items.length) console.log(items);
    }, [items]);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowModal(true);
    }

    const handleDeleteUser = (id: number) => {
        console.log('Delete', id);
    }

    const handleFormSubmit = (updateUser: User) => {
        console.log(updateUser);
        setShowModal(false);
        setSelectedUser(null);
    }

    const handleSearch = (query: string) => {
        console.log('Search', query);
    }

    const handleCreateUser = () => {
        setSelectedUser(null);
        setShowModal(true);
    }

    const userActions: Action<User>[] = [
        { label: 'Edit', method: (item: User) => handleEditUser(item) },
        { label: 'Delete', method: (item: User) => handleDeleteUser(item.id) }
    ];

    return(
        <>
            <PageHeader title="Users" onSearch={handleSearch} onCreate={handleCreateUser} />
            {
                data && (
                    <ReusableTable<User>
                        data={items}
                        columns={userColumns}
                        actions={userActions}
                        BodyComponent={UserList}
                    />
                )
            }

            {                
                showModal && <GenericModal title="Edit User" body={<UserForm user={selectedUser} onSubmit={handleFormSubmit} />} show={showModal} onClose={toogleModal} />
            }
        </>
    )
}