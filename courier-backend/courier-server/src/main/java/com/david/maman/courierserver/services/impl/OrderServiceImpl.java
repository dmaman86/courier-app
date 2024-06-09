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

import com.david.maman.courierserver.mappers.BranchMapper;
import com.david.maman.courierserver.mappers.OrderMapper;
import com.david.maman.courierserver.mappers.UserMapper;
import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.OrderRepository;
import com.david.maman.courierserver.repositories.OrderStatusHistoryRepository;
import com.david.maman.courierserver.services.BranchService;
import com.david.maman.courierserver.services.ContactService;
import com.david.maman.courierserver.services.OfficeService;
import com.david.maman.courierserver.services.OrderService;
import com.david.maman.courierserver.services.OrderStatusHistoryService;
import com.david.maman.courierserver.services.StatusService;
import com.david.maman.courierserver.services.UserService;

@Service
public class OrderServiceImpl implements OrderService{

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;
    // private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private OfficeService officeService;

    @Autowired
    private BranchService branchService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private StatusService statusService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BranchMapper branchMapper;


    @Override
    @Transactional(readOnly = true)
    public OrderDto findById(Long id){
        Order order = orderRepository.findById(id).orElseThrow(
            () -> new RuntimeException("Order not found")
        );
        
        return orderMapper.toDto(order);
    }

    @Override
    public Page<OrderDto> getOrdersByClientId(Long clientId, Pageable pageable){
        Page<Order> ordersPage = orderRepository.findByClientId(clientId, pageable);
        List<OrderDto> ordersDto = ordersPage.getContent().stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
        Page<OrderDto> ordersDtoPage = new PageImpl<>(ordersDto, pageable, ordersPage.getTotalElements());
        return ordersDtoPage;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersbyCourierForToday(Long courierId, Pageable pageable){
        Page<Order> ordersPage = orderRepository.findOrdersByCourierIdForToday(courierId, pageable);
        List<OrderDto> ordersDto = ordersPage.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
        return new PageImpl<>(ordersDto, pageable, ordersPage.getTotalElements());

    }

    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto) {

        Order orderToCreate = orderMapper.toEntity(orderDto);
        logger.info("Order to create: {}", orderToCreate);

        Branch originBranch = branchService.findBranchById(orderToCreate.getOriginBranch().getId()).get();
        logger.info("origin branch {}", originBranch);

        Branch destinationBranch = null;
        List<Contact> contacts = new ArrayList<>();

        List<User> couriers = orderToCreate.getCouriers().size() > 0 ? orderToCreate.getCouriers()
                                                                : Collections.emptyList();
        
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
        }

        Status statusPending = statusService.findStatusByName("PENDING").orElseThrow(
            () -> new RuntimeException("Status not found")
        );
        
        Order order = Order.builder()
                            .client(orderToCreate.getClient())
                            .originBranch(originBranch)
                            .destinationBranch(destinationBranch)
                            .contacts(contacts)
                            .couriers(couriers)
                            .deliveryDate(orderDto.getDeliveryDate())
                            .receiverName(orderDto.getReceiverName())
                            .receiverPhone(orderDto.getReceiverPhone())
                            .destinationAddress(orderDto.getDestinationAddress())
                            .currentStatus(statusPending)
                            .isDelivered(false)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

        logger.info("Order created: {}", order);

        Order savedOrder = this.save(order);
        logger.info("Order saved: {}", savedOrder);
        // orderStatusHistoryService.addStatusToOrder(savedOrder, statusPending, null);
        return orderMapper.toDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderDto updateOrder(Long orderId, OrderDto orderDto){
        Order existingOrder = orderRepository.findById(orderId).orElseThrow(
            () -> new RuntimeException("Order not found")
        );

        User client = userService.loadUserById(orderDto.getClient().getId()).orElseThrow(
            () -> new RuntimeException("Client not found")
        );

        Branch originBranch = findBranchById(orderDto.getOriginBranch().getId());

        Office destinationOffice = null;
        Branch destinationBranch = null;
        List<Contact> contacts = new ArrayList<>();
        List<User> couriers = new ArrayList<>();

        if(orderDto.getDestinationBranch() != null){
            destinationBranch = findBranchById(orderDto.getDestinationBranch().getId());

            if(orderDto.getContacts() != null){
                contacts = orderDto.getContacts().stream()
                    .map(contactDto -> {
                        return Contact.builder()
                                    .id(contactDto.getId())
                                    .name(contactDto.getName())
                                    .phone(contactDto.getPhone())
                                    .build();
                    })
                    .collect(Collectors.toList());
            }
            if(orderDto.getCouriers() != null){
                couriers = orderDto.getCouriers().stream()
                            .map(userDto -> {
                                return userMapper.toEntity(userDto);
                            })
                            .collect(Collectors.toList());
            }
        }else if(orderDto.getDestinationAddress() == null || orderDto.getReceiverName() == null || orderDto.getReceiverPhone() == null){
            throw new IllegalArgumentException("Destination address, receiver name and receiver phone are required");
        }

        orderMapper.updateEntityFromDto(existingOrder, orderDto, originBranch, destinationBranch, contacts, couriers);
        Order updatedOrder = this.save(existingOrder);
        return orderMapper.toDto(updatedOrder);
    }

    @Override
    public void changeOrderStatus(Long orderId, Long statusId, Long adminId, List<Long> courierIds){

    }

    @Override
    @Transactional
    public OrderDto clientUpdateOrder(OrderDto orderDto){

        return orderDto;
    }

    @Transactional
    private Order save(Order order){
        return orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        Page<Order> ordersPage = orderRepository.findAll(pageable);
        List<OrderDto> ordersDto = ordersPage.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());

        return new PageImpl<>(ordersDto, pageable, ordersPage.getTotalElements());
    }


    private Office findOfficeById(Long id) {
        return officeService.findOfficeById(id).orElseThrow(
            () -> new RuntimeException("Office not found")
        );
    }

    private Branch findBranchById(Long id) {
        return branchService.findBranchById(id).orElseThrow(
            () -> new RuntimeException("Branch not found")
        );
    }

    private boolean canClientUpdateOrder(Order order){
        return false;
    }

}
