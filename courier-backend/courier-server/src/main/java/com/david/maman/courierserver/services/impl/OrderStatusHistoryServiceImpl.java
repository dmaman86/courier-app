package com.david.maman.courierserver.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.OrderStatusHistoryRepository;
import com.david.maman.courierserver.repositories.StatusRepository;
import com.david.maman.courierserver.repositories.UserRepository;
import com.david.maman.courierserver.services.OrderStatusHistoryService;

@Service
public class OrderStatusHistoryServiceImpl implements OrderStatusHistoryService{

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public void addStatusToOrder(Order order, Status status, User admin){
        
        OrderStatusHistory orderStatusHistory = OrderStatusHistory.builder()
                                                                .order(order)
                                                                .status(status)
                                                                .admin(admin)
                                                                .timestamp(LocalDateTime.now())   
                                                                .build();
        order.getStatusHistory().add(orderStatusHistory);
        orderStatusHistoryRepository.save(orderStatusHistory);
    }

    @Override
    public List<OrderStatusHistory> getOrderStatusHistory(Long orderId){
        return orderStatusHistoryRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }

    @Override
    public OrderStatusHistory getCurrentStatus(Long orderId){
        return orderStatusHistoryRepository.findByOrderIdOrderByTimestampDesc(orderId).stream().findFirst().orElseThrow(
            () -> new RuntimeException("No status history found for order with id: " + orderId + "!")
        );
    }

}
