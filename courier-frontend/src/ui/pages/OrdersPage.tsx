import { useEffect, useState } from "react";
import moment from "moment";

import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { Order, PageResponse, ValueColumn } from "@/domain";
import { ItemsPage, OrderForm } from "@/ui";
import { PageProps } from "./interface";
import { withLoading } from "@/hoc";
import { Box, Divider } from "@mui/material";

const OrdersPage = ({ userDetails }: PageProps) => {

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

    const getOrders = (page: number, size: number) => serviceRequest.getItem<PageResponse<Order[]>>(`${paths.courier.orders}?page=${page}&size=${size}`);

    const createOrUpdateOrder = (order: Order) => order?.id ? serviceRequest.putItem<Order, Order>(`${paths.courier.orders}${order.id}`, order) : serviceRequest.postItem<Order, Order>(paths.courier.orders, order);

    const deleteOrder = (orderId: number) => serviceRequest.deleteItem<string>(`${paths.courier.orders}${orderId}`);

    // const isAdmin = userDetails ? userDetails.roles.some(role => role.name === 'ROLE_ADMIN') : false;

    const isClient = userDetails.roles.some(role => role.name === 'ROLE_CLIENT');

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

    const renderOrderInfo = (order: Order) => [
        {
            key: 'client',
            content: order.client ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{order.client.name} {order.client.lastName}</span>
                    <span>{order.client.phone}</span>
                    <span>{order.client.email}</span>
                </div>
            ) : (
                <div>Client information is missing</div>
            )
        },
        {
            key: 'origin',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{order.originBranch?.office.name}</span>
                    <span>{order.originBranch?.city} {order.originBranch?.address}</span>
                </div>
            )
        },
        {
            key: 'destination',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {order.destinationBranch && <span>{order.destinationBranch.office.name}</span>}
                    {order.destinationBranch ? <span>{order.destinationBranch.city} {order.destinationBranch.address}</span> : <span>{order.destinationAddress}</span>}
                </div>
            )
        },
        {
            key: 'status',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {order.currentStatus?.name}
                    <i className='fas fa-info-circle' style={{ marginLeft: '5px' }}></i>
                </div>
            )
        },
        {
            key: 'couriers',
            content: (
                !isClient && order.couriers.map((courier, index) => (
                    <Box key={courier.id}>
                        <div>{courier.name} {courier.lastName}</div>
                        <div>{courier.phone}</div>
                        {index < order.couriers.length - 1 && <Divider />}
                    </Box>
                ))
            )
        }
    ]

    const formatMessage = (order: Order) => {
        return `Are you sure you want to delete:
                Order ID: ${order.id}
                Origin: ${order.originBranch.city} - ${order.originBranch.address}
                Destination: ${order.destinationBranch?.city} - ${order.destinationBranch?.address}`;
    }

    return(
        <>
            <ItemsPage<Order>
                userDetails={userDetails}
                header={{
                    title: 'Orders',
                    placeholder: 'Search order...',
                    buttonName: 'Create Order'
                }}
                getItems={getOrders}
                actions={{
                    createOrUpdateItem: createOrUpdateOrder,
                    deleteItem: deleteOrder
                }}
                list={{
                    columns: orderColumns,
                    // itemList: (data, actions) => <OrderList data={data} actions={actions}/>,
                    renderItemColumns: renderOrderInfo,
                    itemForm: (item, onSubmit, onClose) => <OrderForm item={item} onSubmit={onSubmit} onClose={onClose}/>
                }}
                options={{
                    showSearch: false,
                    allowedRoles: orderAllowedRoles
                }}
                initialItem={initialOrder}
                formatMessage={formatMessage}
            />
        </>
    )
}

export default withLoading(OrdersPage);