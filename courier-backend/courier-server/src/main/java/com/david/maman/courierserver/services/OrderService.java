package com.david.maman.courierserver.services;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.User;

public interface OrderService {

    OrderDto findById(Long id);

    Page<OrderDto> getAllOrders(Pageable pageable, User loggedUser);

    OrderDto createOrder(OrderDto orderDto, User loggedUser);

    OrderDto updateOrder(Long orderId, OrderDto orderDto, User loggedUser);
}
