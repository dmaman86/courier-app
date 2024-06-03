package com.david.maman.courierserver.services;

import java.util.List;

import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.models.entities.User;

public interface OrderStatusHistoryService {

    void addStatusToOrder(Order order, Status status, User admin);

    List<OrderStatusHistory> getOrderStatusHistory(Long orderId);

    OrderStatusHistory getCurrentStatus(Long orderId);
}
