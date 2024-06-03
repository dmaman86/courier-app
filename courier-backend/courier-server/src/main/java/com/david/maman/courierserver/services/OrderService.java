package com.david.maman.courierserver.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;

public interface OrderService {

    OrderDto findById(Long id);

    Page<OrderDto> getAllOrders(Pageable pageable);

    Page<OrderDto> getOrdersByClientId(Long clientId, Pageable pageable);

    Page<OrderDto> getOrdersbyCourierForToday(Long courierId, Pageable pageable);

    OrderDto createOrder(OrderDto orderDto);

    List<OrderStatusHistory> getOrderStatusHistory(Long orderId);

    OrderStatusHistory getCurrentStatus(Long orderId);

}
