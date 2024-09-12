import { useEffect, useState } from "react";

import { paths } from "@/helpers";
import { serviceRequest } from "@/services"
import { PageResponse, StatusOrder, ValueColumn } from "@/domain";
import { useAuth } from "@/hooks";
import { ItemsPage, StatusOrderForm, StatusOrdersList } from "@/ui";

export const StatusOrdersPartial = () => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const statusOrder: StatusOrder = {
        id: 0,
        name: '',
        description: ''
    };

    const fetchStatusOrders = (page: number, size: number) => serviceRequest.getItem<PageResponse<StatusOrder[]>>(`${paths.courier.statusOrder}?page=${page}&size=${size}`);

    const createOrUpdateStatusOrder = (statusOrder: StatusOrder) => statusOrder.id ? serviceRequest.putItem<StatusOrder>(paths.courier.statusOrder, statusOrder) :
                                                    serviceRequest.postItem<StatusOrder>(paths.courier.statusOrder, statusOrder);

    const deleteStatusOrder = (statusOrderId: number) => serviceRequest.deleteItem<string>(`${paths.courier.statusOrder}id/${statusOrderId}`);

    const [ statusOrdersColumns, setStatusOrdersColumns ] = useState<ValueColumn[]>([
        { key: 'statusOrder', label: 'Status Order Name' },
        { key: 'description', label: 'Description' },
    ]);

    useEffect(() =>{
        if(userDetails && userDetails.roles.some(role => role.name === 'ROLE_ADMIN')){
            setStatusOrdersColumns([...statusOrdersColumns, { key: 'actions', label: '' }]);
        }
    }, [userDetails]);

    /*const statusOrdersColumns: ValueColumn[] = [
        { key: 'statusOrder', label: 'Status Order Name' },
        { key: 'description', label: 'Description' }
    ]*/

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    const statusOrderAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<StatusOrder>
                        userDetails={userDetails}
                        title="Status Order"
                        placeholder="Search status order..."
                        buttonName="Create Status Order"
                        fetchItems={fetchStatusOrders}
                        createOrUpdateItem={createOrUpdateStatusOrder}
                        deleteItem={deleteStatusOrder}
                        renderItemForm={(item, setItem, onSubmit) => <StatusOrderForm statusOrder={item} setStatusOrder={setItem} onSubmit={onSubmit}/>}
                        columns={statusOrdersColumns}
                        renderItemList={({ data, actions }) => <StatusOrdersList data={data} actions={actions}/>}
                        showSearch={false}
                        allowedRoles={statusOrderAllowedRoles}
                        initialItem={statusOrder}
                    />
                )
            }
        </>
    )
}