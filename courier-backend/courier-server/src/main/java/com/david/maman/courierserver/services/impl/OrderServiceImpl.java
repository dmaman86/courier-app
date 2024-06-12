package com.david.maman.courierserver.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.helpers.StatusEnum;
import com.david.maman.courierserver.mappers.OrderMapper;
import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.OrderRepository;
import com.david.maman.courierserver.services.BranchService;
import com.david.maman.courierserver.services.OfficeService;
import com.david.maman.courierserver.services.OrderService;
import com.david.maman.courierserver.services.StatusService;
import com.david.maman.courierserver.services.UserService;

@Service
public class OrderServiceImpl implements OrderService{

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private OfficeService officeService;

    @Autowired
    private BranchService branchService;

    @Autowired
    private StatusService statusService;


    @Override
    @Transactional(readOnly = true)
    public OrderDto findById(Long id){
        Order order = orderRepository.findById(id).orElseThrow(
            () -> new RuntimeException("Order not found")
        );
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable, User loggedUser) {
        boolean isAdmin = loggedUser.getRoles().stream()
            .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
        boolean isCourier = loggedUser.getRoles().stream()
                            .anyMatch(role -> role.getName().equals("ROLE_COURIER"));
        boolean isClient = loggedUser.getRoles().stream()
                            .anyMatch(role -> role.getName().equals("ROLE_CLIENT"));
        Page<Order> ordersPage = null;

        if(isAdmin)
            ordersPage = getAllOrdersForAdmin(pageable);
        else if(isCourier)
            ordersPage = getAllOrdersForCourier(loggedUser.getId(), pageable);
        else if(isClient)
            ordersPage = getAllOrdersForClient(loggedUser.getId(), pageable);
        else
            throw new IllegalArgumentException("Unauthorized to get the orders");

        List<OrderDto> ordersDto = ordersPage.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());

        return new PageImpl<>(ordersDto, pageable, ordersPage.getTotalElements());
    }

    private Page<Order> getAllOrdersForAdmin(Pageable pageable){
        return orderRepository.findAll(pageable);
    }

    private Page<Order> getAllOrdersForClient(Long clientId, Pageable pageable){
        List<Status> statuses = statusService.getFinishProccess();
        return orderRepository.findByClientIdAndCurrentStatusNotIn(clientId, statuses, pageable);
    }

    private Page<Order> getAllOrdersForCourier(Long courierId, Pageable pageable){
        return orderRepository.findByCouriers_Id(courierId, pageable);
    }

    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto, User loggedUser) {

        Order orderToCreate = orderMapper.toEntity(orderDto);
        logger.info("Order to create: {}", orderToCreate);

        /*Branch originBranch = branchService.findBranchById(orderToCreate.getOriginBranch().getId()).orElseThrow(
            () -> new RuntimeException("Origin branch not found")
        );
        logger.info("origin branch {}", originBranch);*/

        orderToCreate.setOriginBranch(branchService.findBranchById(orderToCreate.getOriginBranch().getId()).orElseThrow(
            () -> new RuntimeException("Origin branch not found")
        ));
        orderToCreate.setCouriers(Collections.emptyList());

        Branch destinationBranch = null;
        List<Contact> contacts = new ArrayList<>();

        /*List<User> couriers = orderToCreate.getCouriers().size() > 0 ? orderToCreate.getCouriers()
                                                                : Collections.emptyList();*/

        if(orderToCreate.getDestinationBranch() != null){
            destinationBranch = branchService.findBranchById(orderToCreate.getDestinationBranch().getId()).get();
            Office destinationOffice = officeService.findOfficeById(orderToCreate.getDestinationBranch().getOffice().getId()).get();

            if(orderToCreate.getContacts().size() > 0){
                contacts = orderToCreate.getContacts().stream()
                    .map(contactDto -> {
                        return Contact.builder()
                                    .id(contactDto.getId())
                                    .name(contactDto.getName())
                                    .phone(contactDto.getPhone())
                                    .office(destinationOffice)
                                    .branches(destinationOffice.getBranches())
                                    .build();
                    })
                    .collect(Collectors.toList());
            }
        }else{
            if(orderToCreate.getDestinationAddress().isBlank() || orderToCreate.getReceiverName().isBlank() || orderToCreate.getReceiverPhone().isBlank()){
                throw new IllegalArgumentException("Destination address, receiver name and receiver phone are required");
            }
        }
        orderToCreate.setDestinationBranch(destinationBranch);
        orderToCreate.setContacts(contacts);
        

        /*Status statusPending = statusService.findStatusByName("PENDING").orElseThrow(
            () -> new RuntimeException("Status not found")
        );*/

        orderToCreate.setCurrentStatus(statusService.findStatusByName("PENDING").orElseThrow(
            () -> new RuntimeException("Status not found")
        ));
        orderToCreate.setIsDelivered(false);
        orderToCreate.setCreatedAt(LocalDateTime.now());
        orderToCreate.setUpdatedAt(LocalDateTime.now());
        orderToCreate.setClient(loggedUser);

        logger.info("Order created before save: {}", orderToCreate);

        Order savedOrder = this.save(orderToCreate);
        logger.info("Order saved: {}", savedOrder);
        // orderStatusHistoryService.addStatusToOrder(savedOrder, statusPending, null);
        return orderMapper.toDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderDto updateOrder(Long orderId, OrderDto orderDto, User loggedUser){
        Order existingOrder = orderRepository.findById(orderId).orElseThrow(
            () -> new RuntimeException("Order not found")
        );
        Order updatedOrder = null;

        boolean isAdmin = loggedUser.getRoles().stream()
            .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
        boolean isCourier = existingOrder.getCouriers().stream()
            .anyMatch(courier -> courier.getId().equals(loggedUser.getId()));
        
        if(existingOrder.getClient().getId().equals(loggedUser.getId()))
            updatedOrder = clientUpdateOrder(existingOrder, orderDto);
        else if(isAdmin || isCourier)
            updatedOrder = updateOrderStatus(existingOrder, orderDto);
        else
            throw new IllegalArgumentException("Unauthorized to update the order");

        return orderMapper.toDto(updatedOrder);
    }

    @Transactional
    private Order clientUpdateOrder(Order existingOrder, OrderDto orderDto){
        if(!canClientUpdateOrder(existingOrder)){
            throw new RuntimeException("Order can't be updated");
        }

        existingOrder.setOriginBranch(branchService.findBranchById(orderDto.getOriginBranch().getId()).orElseThrow(
            () -> new RuntimeException("Origin branch not found")
        ));

        if(orderDto.getDestinationBranch() != null){
            existingOrder.setDestinationBranch(branchService.findBranchById(orderDto.getDestinationBranch().getId()).get());
            Office destinationOffice = officeService.findOfficeById(orderDto.getDestinationBranch().getOffice().getId()).get();

            if(orderDto.getContacts().size() > 0){
                List<Contact> contacts = orderDto.getContacts().stream()
                    .map(contactDto -> {
                        return Contact.builder()
                                    .id(contactDto.getId())
                                    .name(contactDto.getName())
                                    .phone(contactDto.getPhone())
                                    .office(destinationOffice)
                                    .branches(destinationOffice.getBranches())
                                    .build();
                    })
                    .collect(Collectors.toList());
                existingOrder.setContacts(contacts);
            }
        }else{
            if(orderDto.getDestinationAddress().isBlank() || orderDto.getReceiverName().isBlank() || orderDto.getReceiverPhone().isBlank()){
                throw new IllegalArgumentException("Destination address, receiver name and receiver phone are required");
            }
            existingOrder.setDestinationAddress(orderDto.getDestinationAddress());
            existingOrder.setReceiverName(orderDto.getReceiverName());
            existingOrder.setReceiverPhone(orderDto.getReceiverPhone());
        }
        existingOrder.setCurrentStatus(statusService.findStatusByName("PENDING").orElseThrow(
            () -> new RuntimeException("Status not found")
        ));
        existingOrder.setUpdatedAt(LocalDateTime.now());
        return this.save(existingOrder);
    }

    @Transactional
    private Order updateOrderStatus(Order existingOrder, OrderDto orderDto){
        Status status = statusService.findStatusByName(orderDto.getCurrentStatus().getName()).orElseThrow(
            () -> new RuntimeException("Status not found")
        );
        existingOrder.setCurrentStatus(status);
        existingOrder.setCouriers(orderDto.getCouriers().stream()
            .map(courierDto -> {
                return userService.loadUserById(courierDto.getId()).orElseThrow(
                    () -> new RuntimeException("Courier not found")
                );
            })
            .collect(Collectors.toList()));
        existingOrder.setUpdatedAt(LocalDateTime.now());
        return this.save(existingOrder);
    }

    @Transactional
    private Order save(Order order){
        return orderRepository.save(order);
    }

    private boolean canClientUpdateOrder(Order order){
        StatusEnum cancelled = StatusEnum.CANCELLED;
        StatusEnum denied = StatusEnum.DENIED;
        StatusEnum delivered = StatusEnum.DELIVERED;
        StatusEnum returned = StatusEnum.RETURNED;
        StatusEnum inTransit = StatusEnum.IN_TRANSIT;

        List<Status> nonUpdatebleStatus = statusService.getAllById(
            List.of(cancelled.getId(), denied.getId(), delivered.getId(), returned.getId(), inTransit.getId())
        );

        return !nonUpdatebleStatus.contains(order.getCurrentStatus());
    }

}
