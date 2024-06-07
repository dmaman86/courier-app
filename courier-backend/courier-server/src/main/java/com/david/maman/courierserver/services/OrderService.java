package com.david.maman.courierserver.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.models.entities.Status;

public interface OrderService {

    OrderDto findById(Long id);

    Page<OrderDto> getAllOrders(Pageable pageable);

    Page<OrderDto> getOrdersByClientId(Long clientId, Pageable pageable);

    Page<OrderDto> getOrdersbyCourierForToday(Long courierId, Pageable pageable);

    OrderDto createOrder(OrderDto orderDto);

    OrderDto updateOrder(Long orderId, OrderDto orderDto);

    void changeOrderStatus(Long orderId, Long statusId, Long adminId, List<Long> courierIds);

    OrderDto clientUpdateOrder(OrderDto orderDto);

}
