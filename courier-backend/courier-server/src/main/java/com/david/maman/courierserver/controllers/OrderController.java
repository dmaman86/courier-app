package com.david.maman.courierserver.controllers;

import java.util.List;

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

import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.services.OrderService;

@RestController
@RequestMapping("/api/courier/order")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping("/")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto){
        //OrderDto createdOrder = orderService.createOrder(orderDto);
        logger.info("Receive order dto: {}", orderDto);
        OrderDto createdOrder = orderService.createOrder(orderDto);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, @RequestBody OrderDto orderDto){
        OrderDto updatedOrder = orderService.updateOrder(orderId, orderDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllOrders(@RequestParam(value = "page", defaultValue = "0") int page,
                                          @RequestParam(value = "size", defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDto> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId){
        return ResponseEntity.ok("delete");
    }

    @GetMapping("/client/{clientid}")
    public ResponseEntity<?> getOrdersByClient(@PathVariable Long clientid,
                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "size", defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDto> orders = orderService.getOrdersByClientId(clientid, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/courier/{courierId}/today")
    public ResponseEntity<?> getOrdersByCourierForToday(@PathVariable Long courierId,
                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "size", defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDto> orders = orderService.getOrdersbyCourierForToday(courierId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId){
        OrderDto order = orderService.findById(orderId);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/client/update")
    public ResponseEntity<OrderDto> clientUpdateOrder(@RequestBody OrderDto orderDto) {
        OrderDto updatedOrder = orderService.clientUpdateOrder(orderDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/status")
    public ResponseEntity<Void> changeOrderStatus(@RequestParam Long orderId, @RequestParam Long statusId, @RequestParam(required = false) Long adminId, @RequestParam(required = false) List<Long> courierIds) {
        orderService.changeOrderStatus(orderId, statusId, adminId, courierIds);
        return ResponseEntity.ok().build();
    }

}
