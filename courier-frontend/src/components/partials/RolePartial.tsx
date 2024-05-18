import { useCallback, useEffect, useState } from "react";
import { Action, AxiosCall, FetchResponse, Role, User, ValueColumn } from "../../types";
import { useFetchAndLoad, useList } from "../../hooks";
import { serviceRequest } from "../../services";
import { paths } from "../../helpers";
import { AlertDialog, PageHeader, ReusableTable } from "../shared";
import { GenericModal, RoleForm } from "../modal";
import { RoleList } from "./RoleList";
import { AxiosError } from "axios";

const rolesColumns: ValueColumn[] = [
    {
        key: 'role',
        label: 'Role Name'
    }
];

export const RolePartial = ({ userDetails }: { userDetails: User}) => {

    const [ showModal, setShowModal ] = useState(false);
    const [ showAlertDialog, setShowAlertDialog ] = useState(false);
    const [ selectedRole, setSelectedRole ] = useState<Role | null>(null);
    const [ roleToDelete, setRoleToDelete ] = useState<Role | null>(null);
    const { items, setAllItems, addItem, updateItem, removeItem, existItem } = useList<Role>([]);

    const [ titleAlert, setTitleAlert ] = useState<string>('');
    const [ isConfirm, setIsConfirm ] = useState<boolean>(true);

    const [ responseList, setResponseList ] = useState<FetchResponse<Role[]>>({
        data: null,
        error: null
    });

    const [ responseRole, setResponseRole ] = useState<FetchResponse<Role>>({
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
            setSelectedRole(null);
            setRoleToDelete(null);
            setIsConfirm(true);
        }
    }, []);

    const toggleModal = () => setShowModal(!showModal);

    const toggleAlertDialog = () => setShowAlertDialog(!showAlertDialog);

    const fetchRoles = useCallback(async () => {
        const result = await callEndPoint(serviceRequest.getItem<Role[]>(paths.courier.roles));
        setResponseList(result);
    }, [callEndPoint]);

    const createOrUpdateRole = useCallback(async (axiosCall: AxiosCall<Role>) => {
        const result = await callEndPoint(axiosCall);
        setResponseRole(result);
    }, [callEndPoint]);

    const deleteRole = useCallback(async (roleId: number) => {
        const url = `${paths.courier.roles}/id/${roleId}`;
        const result = await callEndPoint(serviceRequest.deleteItem<string>(url));
        setDeleteResponse(result);
    }, [callEndPoint]);

    useEffect(() => {
        if(userDetails && !responseList.data && !responseList.error) fetchRoles();
    }, [fetchRoles, userDetails, responseList]);

    useEffect(() => {
        if(!loading && responseList.data && !responseList.error) setAllItems(responseList.data);
    }, [loading, responseList, setAllItems]);

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setShowModal(true);
    }

    const handleDeleteRole = (role: Role) => {
        setRoleToDelete(role);
        setTitleAlert(`Are you sure you want to delete the role: ${role.name}?`);
        setIsConfirm(true);
        setShowAlertDialog(true);
    }

    const confirmDeleteRole = async () => {
        if(roleToDelete){
            console.log('Deleting role: ', roleToDelete);
            setShowAlertDialog(false);
            await deleteRole(roleToDelete.id);
        }
    }

    useEffect(() => {
        if(!loading && deleteResponse.data){
            removeItem(roleToDelete!.id);
            setRoleToDelete(null);
            setDeleteResponse({ data: null, error: null });
        }else if(!loading && deleteResponse.error){
            const { error } = deleteResponse;
            if(error instanceof AxiosError && error.response){
                setTitleAlert(error.response.data);
                setIsConfirm(false);
                setShowAlertDialog(true);
            }
            setRoleToDelete(null);
            setDeleteResponse({ data: null, error: null });
        }
    }, [deleteResponse, loading, removeItem, roleToDelete]);

    const handleFormSubmit = async (role: Role) => {
        console.log('Role to save: ', role);
        const url = paths.courier.roles;

        const axiosCall = role.id ? serviceRequest.putItem<Role>(url, role) : 
                                    serviceRequest.postItem<Role>(url, role);

        await createOrUpdateRole(axiosCall);
    }

    useEffect(() => {
        if(!loading && responseRole.data && !responseRole.error){
            const { data: role } = responseRole;
            if(!existItem(role.id)) addItem(role);
            else updateItem(role);

            setResponseRole({ data: null, error: null });
            setShowModal(false);
            setSelectedRole(null);
        }
    }, [addItem, existItem, loading, responseRole, updateItem]);

    const handleCreateRole = () => {
        setSelectedRole(null);
        setShowModal(true);
    }

    const roleActions: Action<Role>[] = [
        { label: 'Edit', classNameButton: 'btn btn-outline-warning', classNameIcon: 'fas fa-edit', method: (item: Role) => handleEditRole(item) },
        { label: 'Delete', classNameButton: 'btn btn-outline-danger', classNameIcon: 'fas fa-trash-alt',method: (item: Role) => handleDeleteRole(item) }
    ];

    return (
        <>
            <PageHeader title="Settings Roles" placeholder="Search role..." buttonName="Create Role" onCreate={handleCreateRole} />
            {
                items.length > 0 && (
                    <div className="container">
                        <ReusableTable<Role> 
                            data={items}
                            columns={rolesColumns}
                            actions={roleActions}
                            BodyComponent={RoleList}
                        />
                    </div>
                )
            }
            {
                showModal && (<GenericModal title="Create or Edit Role" body={<RoleForm role={selectedRole} onSubmit={handleFormSubmit}/>} show={showModal} onClose={toggleModal}/>)
            }
            {
                showAlertDialog && (<AlertDialog open={showAlertDialog} onClose={toggleAlertDialog} onConfirm={confirmDeleteRole} title={titleAlert} isConfirm={isConfirm}/>)
            }
        </>
    );
}