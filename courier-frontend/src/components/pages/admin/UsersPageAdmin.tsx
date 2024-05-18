import { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";

import { Action, AxiosCall, FetchResponse, User, ValueColumn } from "../../../types";
import { useAuth, useFetchAndLoad, useList } from "../../../hooks";
import { serviceRequest } from "../../../services";
import { paths } from "../../../helpers";
import { AlertDialog, PageHeader, ReusableTable } from "../../shared";
import { UserList } from "../../partials";
import { GenericModal, UserForm } from "../../modal";

const userColumns: ValueColumn[] = [
    {
        key: 'fullname',
        label: 'Fullname'
    },
    {
        key: 'contactInfo',
        label: 'Contact Information'
    },
    {
        key: 'roles',
        label: 'Roles'
    }
];


export const UsersPageAdmin = () => {

    const { userDetails } = useAuth();
    const [ showModal, setShowModal ] = useState(false);
    const [ showAlertDialog, setShowAlertDialog ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState<User | null>(null);
    const [ userToDelete, setUserToDelete ] = useState<User | null>(null);
    const { items, setAllItems, addItem, updateItem, removeItem, existItem } = useList<User>([]);
    
    const [ responseList, setResponseList ] = useState<FetchResponse<User[]>>({
        data: null,
        error: null
    });

    const [ responseUser, setResponseUser ] = useState<FetchResponse<User>>({
        data: null,
        error: null
    });

    const [ deleteResponse, setDeleteResponse ] = useState<FetchResponse<string>>({
        data: null,
        error: null
    });

    const { loading, callEndPoint } = useFetchAndLoad();

    useEffect(() => {
        return () => {
            setShowModal(false);
            setShowAlertDialog(false);
            setSelectedUser(null);
            setUserToDelete(null);
            setResponseList({ data: null, error: null });
            setResponseUser({ data: null, error: null });
            setDeleteResponse({ data: null, error: null });
        }
    }, []);


    const toggleModal = () => setShowModal(!showModal);

    const toggleAlertDialog = () => setShowAlertDialog(!showAlertDialog);

    const fetchUsers = useCallback(async () => {
        const result = await callEndPoint(serviceRequest.getItem<User[]>(paths.courier.users));
        setResponseList(result);
    }, [callEndPoint]);

    const createOrUpdateUser = useCallback(async (axiosCall: AxiosCall<User>) => {
        const result = await callEndPoint(axiosCall);
        setResponseUser(result);
    }, [callEndPoint]);

    const deleteUser = useCallback(async (userId: number) => {
        const url = `${paths.courier.deleteUser}/${userId}`;
        const result = await callEndPoint(serviceRequest.deleteItem<string>(url));
        setDeleteResponse(result);
    }, [callEndPoint]);

    useEffect(() => {
        if(userDetails && !responseList.data && !responseList.error) fetchUsers();
    }, [fetchUsers, userDetails]);

    useEffect(() => {
        if(!loading && responseList.data && !responseList.error) setAllItems(responseList.data);
    }, [loading, responseList, setAllItems]);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowModal(true);
    }

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowAlertDialog(true);
    }

    const confirmDeleteUser = async () => {
        if(userToDelete){
            console.log('Delete user', userToDelete);
            await deleteUser(userToDelete.id);
        }
    }

    useEffect(() => {
        if(!loading && deleteResponse.data && !deleteResponse.error){
            removeItem(userToDelete!.id);
            setUserToDelete(null);
            setShowAlertDialog(false);
            setDeleteResponse({ data: null, error: null });
        }
    }, [deleteResponse, loading, removeItem, userToDelete]);

    const handleFormSubmit = async (updateUser: User) => {
        console.log(updateUser);

        const url = paths.courier.createOrUpdateUser;
        const axiosCall = updateUser.id ? serviceRequest.putItem<User, User>(url, updateUser) : 
                                        serviceRequest.postItem<User, User>(url, updateUser);

        await createOrUpdateUser(axiosCall);
    }

    useEffect(() => {
        if(!loading && responseUser.data && !responseUser.error){
            const { data: user } = responseUser;
            if(!existItem(user.id)) addItem(user);
            else updateItem(user);

            setResponseUser({ data: null, error: null });
            setShowModal(false);
            setSelectedUser(null);
        }
    }, [addItem, existItem, loading, responseUser, updateItem]);

    const handleSearch = useCallback(async (query: string) => {
        if(query){
            console.log('Search', query);
            const result = await callEndPoint(serviceRequest.getItem<User[]>(`${paths.courier.users}/search?query=${query}`));
            setResponseList(result);
        }
    }, [callEndPoint]);

    const handleCreateUser = () => {
        setSelectedUser(null);
        setShowModal(true);
    }

    const userActions: Action<User>[] = [
        { label: 'Edit', classNameButton: 'btn btn-outline-warning', classNameIcon: 'fas fa-edit', method: (item: User) => handleEditUser(item) },
        { label: 'Delete', classNameButton: 'btn btn-outline-danger', classNameIcon: 'fas fa-trash-alt',method: (item: User) => handleDeleteUser(item) }
    ];

    return(
        <>
            <PageHeader title="Users" placeholder="Search user..." buttonName="Create User" onSearch={handleSearch} onCreate={handleCreateUser} />
            <div className="container">
                {
                    loading ? <CircularProgress disableShrink /> : !items.length ? <div>Not found data.</div> : (
                        <ReusableTable<User>
                            data={items}
                            columns={userColumns}
                            actions={userActions}
                            BodyComponent={UserList}
                        />
                    )
                }
            </div>
            {                
                showModal && <GenericModal title="Edit User" body={<UserForm user={selectedUser} onSubmit={handleFormSubmit} />} show={showModal} onClose={toggleModal} />
            }
            {
                showAlertDialog && (
                    <AlertDialog open={showAlertDialog} onClose={toggleAlertDialog} onConfirm={confirmDeleteUser} title="Are you sure you want to delete this user?" />
                )
            }
        </>
    )
}