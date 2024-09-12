import { useEffect, useState } from "react";
import moment from "moment";

import { paths } from "@/helpers";
import { useAuth } from "@/hooks"
import { serviceRequest } from "@/services";
import { Order, PageResponse, ValueColumn } from "@/domain";
import { ItemsPage, OrderForm, OrderList } from "@/ui";

export const OrdersPage = () => {

    const { userDetails } = useAuth();

    const initialOrder: Order = {
        id: 0,
        client: null,
        // client: { id: 0, name: '', lastName: '', email: '', phone: '', roles: [], isActive: true },
        originBranch: { id: 0, city: '', address: '', office: { id: 0, name: '' } },
        // originBranch: null,
        // destinationBranch: { id: 0, city: '', address: '', office: { id: 0, name: '' } },
        destinationBranch: null,
        contacts: [],
        deliveryDate: moment().format('DD/MM/YYYY'),
        receiverName: '',
        receiverPhone: '',
        destinationAddress: '',
        couriers: [],
        currentStatus: { id: 0, name: '', description: '' }
    };

    const fetchOrders = (page: number, size: number) => serviceRequest.getItem<PageResponse<Order[]>>(`${paths.courier.orders}?page=${page}&size=${size}`);

    const createOrUpdateOrder = (order: Order) => order?.id ? serviceRequest.putItem<Order, Order>(`${paths.courier.orders}${order.id}`, order) : serviceRequest.postItem<Order, Order>(paths.courier.orders, order);

    const deleteOrder = (orderId: number) => serviceRequest.deleteItem<string>(`${paths.courier.orders}${orderId}`);

    // const isAdmin = userDetails ? userDetails.roles.some(role => role.name === 'ROLE_ADMIN') : false;

    const [ orderColumns, setOrderColumns ] = useState<ValueColumn[]>([
        { key: 'client', label: 'Client Details' },
        { key: 'origin', label: 'Origin Details' },
        { key: 'destination', label: 'Destination Details' },
        { key: 'status', label: 'Status Order' }
    ]);

    const orderAllowedRoles = {
        create: ['ROLE_CLIENT'],
        update: ['ROLE_CLIENT', 'ROLE_ADMIN', 'ROLE_COURIER'],
        delete: ['ROLE_CLIENT', 'ROLE_ADMIN']
    }

    useEffect(() => {
        if(userDetails){
            if(!userDetails.roles.some(role => role.name === 'ROLE_CLIENT')){
                setOrderColumns([...orderColumns, { key: 'courier', label: 'Courier Details' }, { key: 'actions', label: ''}]);
            }else{
                if(userDetails.roles.some(role => orderAllowedRoles.update.includes(role.name) || orderAllowedRoles.delete.includes(role.name))){
                    setOrderColumns([...orderColumns, { key: 'actions', label: ''}]);
                }
            }
            
        }
    }, [userDetails]);

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<Order>
                        userDetails={userDetails}
                        title="Orders"
                        placeholder="Search order..."
                        buttonName="Create Order"
                        fetchItems={fetchOrders}
                        createOrUpdateItem={createOrUpdateOrder}
                        deleteItem={deleteOrder}
                        renderItemForm={(item, setItem, onSubmit) => <OrderForm order={item} setOrder={setItem} onSubmit={onSubmit}/>}
                        columns={orderColumns}
                        renderItemList={({ data, actions }) => <OrderList data={data} actions={actions}/> }
                        showSearch={false}
                        allowedRoles={orderAllowedRoles}
                        initialItem={initialOrder}
                    />
                )
            }
        </>
    )
}