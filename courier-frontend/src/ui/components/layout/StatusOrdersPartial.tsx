import { useEffect, useState } from "react";

import { paths } from "@/helpers";
import { serviceRequest } from "@/services"
import { PageResponse, StatusOrder, ValueColumn } from "@/domain";
import { ItemsPage, StatusOrderForm, StatusOrdersList } from "@/ui";
import { PartialProps } from "./interface";

export const StatusOrdersPartial = ({ userDetails, isAdmin }: PartialProps) => {

    const statusOrder: StatusOrder = {
        id: 0,
        name: '',
        description: ''
    };

    const getStatusOrders = (page: number, size: number) => serviceRequest.getItem<PageResponse<StatusOrder[]>>(`${paths.courier.statusOrder}?page=${page}&size=${size}`);

    const createOrUpdateStatusOrder = (statusOrder: StatusOrder) => statusOrder.id ? serviceRequest.putItem<StatusOrder>(paths.courier.statusOrder, statusOrder) :
                                                    serviceRequest.postItem<StatusOrder>(paths.courier.statusOrder, statusOrder);

    const deleteStatusOrder = (statusOrderId: number) => serviceRequest.deleteItem<string>(`${paths.courier.statusOrder}id/${statusOrderId}`);

    const [ statusOrdersColumns, setStatusOrdersColumns ] = useState<ValueColumn[]>([
        { key: 'statusOrder', label: 'Status Order Name' },
        { key: 'description', label: 'Description' },
    ]);

    useEffect(() =>{
        if(isAdmin){
            setStatusOrdersColumns([...statusOrdersColumns, { key: 'actions', label: '' }]);
        }
    }, [isAdmin]);

    /*const statusOrdersColumns: ValueColumn[] = [
        { key: 'statusOrder', label: 'Status Order Name' },
        { key: 'description', label: 'Description' }
    ]*/

    /*useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);*/

    const statusOrderAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    const formatMessage = (statusOrder: StatusOrder) => {
        return `Are you sure you want to delete:
                Status Order: ${statusOrder.name},
                Description: ${statusOrder.description}`
    }

    return(
        <>
            <ItemsPage<StatusOrder>
                userDetails={userDetails}
                header={{
                    title: 'Status Order',
                    placeholder: 'Search status order...',
                    buttonName: 'Create Status Order'
                }}
                getItems={getStatusOrders}
                actions={{
                    createOrUpdateItem: createOrUpdateStatusOrder,
                    deleteItem: deleteStatusOrder,
                }}
                list={{
                    columns: statusOrdersColumns,
                    itemList: (data, actions) => <StatusOrdersList data={data} actions={actions}/>,
                    itemForm: (item, onSubmit, onClose) => <StatusOrderForm item={item} onSubmit={onSubmit} onClose={onClose}/>
                }}
                options={{
                    showSearch: false,
                    allowedRoles: statusOrderAllowedRoles
                }}
                initialItem={statusOrder}
                formatMessage={formatMessage}
            />
        </>
    )
}