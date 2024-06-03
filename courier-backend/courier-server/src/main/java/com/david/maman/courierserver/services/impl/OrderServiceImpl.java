package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
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

import com.david.maman.courierserver.mappers.OrderMapper;
import com.david.maman.courierserver.mappers.UserMapper;
import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.OrderRepository;
import com.david.maman.courierserver.repositories.OrderStatusHistoryRepository;
import com.david.maman.courierserver.services.BranchService;
import com.david.maman.courierserver.services.ContactService;
import com.david.maman.courierserver.services.OfficeService;
import com.david.maman.courierserver.services.OrderService;
import com.david.maman.courierserver.services.UserService;

@Service
public class OrderServiceImpl implements OrderService{

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

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
    private UserMapper userMapper;


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
        User client = userService.loadUserById(orderDto.getClient().getId()).orElseThrow(
            () -> new RuntimeException("Client not found")
        );

        Contact contact = contactService.findContactByPhone(client.getPhone()).orElseThrow(
            () -> new RuntimeException("Contact not found")
        );

        Office originOffice = findOfficeById(orderDto.getOriginOffice().getId());
        Branch originBranch = findBranchById(orderDto.getOriginBranch().getId());

        Office destinationOffice = null;
        Branch destinationBranch = null;
        List<Contact> contacts = new ArrayList<>();

        if(orderDto.getDestinationOffice().getId() != null){
            destinationOffice = findOfficeById(orderDto.getDestinationOffice().getId());
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
        }else if(orderDto.getDestinationAddress() == null || orderDto.getReceiverName() == null || orderDto.getReceiverPhone() == null){
            throw new IllegalArgumentException("Destination address, receiver name and receiver phone are required");
        }

        Order order = this.save(orderMapper.toEntity(orderDto, client, originOffice, originBranch, destinationOffice, destinationBranch, contacts, List.of()));
        return orderMapper.toDto(order);
    }

    @Transactional
    private Order save(Order order){
        return orderRepository.save(order);
    }


    @Override
    public List<OrderStatusHistory> getOrderStatusHistory(Long orderId){
        return orderStatusHistoryRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }

    @Override
    public OrderStatusHistory getCurrentStatus(Long orderId){
        return orderStatusHistoryRepository.findByOrderIdOrderByTimestampDesc(orderId).stream().findFirst().orElseThrow(
            () -> new RuntimeException("No status history found for order")
        );
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

}
