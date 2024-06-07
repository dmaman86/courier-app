package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.mappers.OrderStatusHistoryMapper;
import com.david.maman.courierserver.models.dto.OrderStatusDto;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.services.OrderStatusHistoryService;

@RestController
@RequestMapping("/api/courier/order-status-history")
public class OrderStatusHistoryController {

    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;

    @Autowired
    private OrderStatusHistoryMapper orderStatusHistoryMapper;

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderStatusHistory(@PathVariable Long orderId){
        List<OrderStatusHistory> orderStatusHistory = orderStatusHistoryService.getOrderStatusHistory(orderId);
        List<OrderStatusDto> statusHistoryDtoList = orderStatusHistory.stream()
                                                                    .map(orderStatusHistoryMapper::toDto)
                                                                    .collect(Collectors.toList());
        return ResponseEntity.ok(statusHistoryDtoList);
    }

}
