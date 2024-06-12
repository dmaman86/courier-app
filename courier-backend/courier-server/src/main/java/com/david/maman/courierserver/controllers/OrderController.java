package com.david.maman.courierserver.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.david.maman.courierserver.helpers.CustomUserDetails;
import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.services.OrderService;

@RestController
@RequestMapping("/api/courier/order")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping("/")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto, Authentication authentication){
        //OrderDto createdOrder = orderService.createOrder(orderDto);
        logger.info("Receive order dto: {}", orderDto);
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        OrderDto createdOrder = orderService.createOrder(orderDto, user.getUser());
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, @RequestBody OrderDto orderDto, Authentication authentication){
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        OrderDto updatedOrder = orderService.updateOrder(orderId, orderDto, user.getUser());
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllOrders(@RequestParam(value = "page", defaultValue = "0") int page,
                                          @RequestParam(value = "size", defaultValue = "10") int size,
                                          Authentication authentication){
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDto> orders = orderService.getAllOrders(pageable, user.getUser());
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId){
        return ResponseEntity.ok("delete");
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId){
        OrderDto order = orderService.findById(orderId);
        return ResponseEntity.ok(order);
    }
}
