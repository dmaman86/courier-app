import { paths } from "../../helpers";
import { serviceRequest } from "../../services"
import { PageResponse, StatusOrder, ValueColumn } from "../../types";
import { StatusOrderForm } from "../modal";
import { ItemsPage } from "../shared";
import { StatusOrdersList } from "../listTables/StatusOrdersList";

export const StatusOrdersPartial = () => {

    const fetchStatusOrders = (page: number, size: number) => serviceRequest.getItem<PageResponse<StatusOrder[]>>(`${paths.courier.statusOrder}?page=${page}&size=${size}`);

    const createOrUpdateStatusOrder = (statusOrder: StatusOrder) => statusOrder.id ? serviceRequest.putItem<StatusOrder>(paths.courier.statusOrder, statusOrder) :
                                                    serviceRequest.postItem<StatusOrder>(paths.courier.statusOrder, statusOrder);

    const deleteStatusOrder = (statusOrderId: number) => serviceRequest.deleteItem<string>(`${paths.courier.statusOrder}id/${statusOrderId}`);

    const statusOrdersColumns: ValueColumn[] = [
        { key: 'statusOrder', label: 'Status Order Name' }
    ]

    return(
        <>
            <ItemsPage<StatusOrder> 
                title="Status Order"
                placeholder="Search status order..."
                buttonName="Create Status Order"
                fetchItems={fetchStatusOrders}
                createOrUpdateItem={createOrUpdateStatusOrder}
                deleteItem={deleteStatusOrder}
                renderItemForm={(statusOrderId, onSubmit) => <StatusOrderForm statusOrderId={statusOrderId} onSubmit={onSubmit}/>}
                columns={statusOrdersColumns}
                renderItemList={({ data, actions}) => <StatusOrdersList data={data} actions={actions}/>}
                showSearch={false}
            />
        </>
    )
}