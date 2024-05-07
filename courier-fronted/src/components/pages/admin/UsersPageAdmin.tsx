import { useState, useEffect } from "react";
import { Action, FetchResponse, User, ValueColumn } from "../../../types";
import { useAuth, useFetchAndLoad, useList } from "../../../hooks";
import { serviceRequest } from "../../../services";
import { paths } from "../../../helpers";
import { ReusableTable } from "../../shared";
import { UserList } from "../../partials/UserList";

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

const userActions: Action<User>[] = [
    { label: 'Edit', method: (item: User) => console.log('Edit', item) },
    { label: 'Delete', method: (item: User) => console.log('Delete', item) }
];


export const UsersPageAdmin = () => {

    const { userDetails } = useAuth();

    const { items, setAllItems, addItem, updateItem, removeItem } = useList<User>([]);
    const [ response, setResponse ] = useState<FetchResponse<User[]>>({
        data: null,
        error: null
    });

    const { loading, callEndPoint } = useFetchAndLoad();

    const { data, error } = response;


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

    return(
        <>
            <h1>Users Page Admin</h1>
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
        </>
    )
}