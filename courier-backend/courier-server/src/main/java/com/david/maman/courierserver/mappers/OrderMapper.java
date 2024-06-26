package com.david.maman.courierserver.mappers;

import java.util.ArrayList;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.User;

@Component
public class OrderMapper {

    private static final Logger logger = LoggerFactory.getLogger(OrderMapper.class);

    @Autowired
    private ContactMapper contactMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private StatusMapper statusMapper;

    @Autowired
    private BranchMapper branchMapper;


    public OrderDto toDto(Order order){
        return OrderDto.builder()
                    .id(order.getId())
                    .client(userMapper.toDto(order.getClient()))
                    .originBranch(branchMapper.toDto(order.getOriginBranch()))
                    .destinationBranch(branchMapper.toDto(order.getDestinationBranch()))
                    .contacts(order.getContacts().stream()
                                .map(contactMapper::toDto)
                                .collect(Collectors.toList()))
                    .couriers(order.getCouriers() != null ? order.getCouriers().stream()
                                .map(userMapper::toDto)
                                .collect(Collectors.toList()) : null)
                    .deliveryDate(order.getDeliveryDate())
                    .receiverName(order.getReceiverName())
                    .receiverPhone(order.getReceiverPhone())
                    .destinationAddress(order.getDestinationAddress())
                    .currentStatus(statusMapper.toDto(order.getCurrentStatus()))
                    .build();
    }

    public Order toEntity(OrderDto orderDto){
        Branch destinationBranch = branchMapper.toEntity(orderDto.getDestinationBranch());
        Office destinationOffice = destinationBranch != null ? destinationBranch.getOffice() : null;
        List<Contact> contacts = destinationOffice != null ? orderDto.getContacts().stream().map(
            contactDto -> contactMapper.toEntity(contactDto, destinationOffice, destinationOffice.getBranches())
        ).collect(Collectors.toList()) : new ArrayList<>();

        List<User> couriers = orderDto.getCouriers() != null ?
            orderDto.getCouriers().stream().map(userMapper::toEntity).collect(Collectors.toList()) :
            new ArrayList<>();

        return Order.builder()
                    .id(orderDto.getId())
                    .client(userMapper.toEntity(orderDto.getClient()))
                    .originBranch(branchMapper.toEntity(orderDto.getOriginBranch()))
                    .destinationBranch(destinationBranch)
                    .contacts(contacts)
                    .couriers(couriers)
                    .deliveryDate(orderDto.getDeliveryDate())
                    .receiverName(orderDto.getReceiverName())
                    .receiverPhone(orderDto.getReceiverPhone())
                    .destinationAddress(orderDto.getDestinationAddress())
                    .currentStatus(statusMapper.toEntity(orderDto.getCurrentStatus()))
                    .isDelivered(false)
                    .build();

    }


    public Order toEntity(OrderDto orderDto, Branch originBranch, Branch destinationBranch, List<Contact> contacts, List<User> couriers){
        Order ord = Order.builder()
                    .id(orderDto.getId())
                    .client(userMapper.toEntity(orderDto.getClient()))
                    .originBranch(originBranch)
                    .destinationBranch(destinationBranch)
                    .contacts(contacts)
                    .couriers(couriers)
                    .deliveryDate(orderDto.getDeliveryDate())
                    .receiverName(orderDto.getReceiverName())
                    .receiverPhone(orderDto.getReceiverPhone())
                    .destinationAddress(orderDto.getDestinationAddress())
                    .currentStatus(statusMapper.toEntity(orderDto.getCurrentStatus()))
                    .isDelivered(false) // Assuming a new order is not delivered yet
                    .build();
        logger.info("Order entity created: {}", ord);
        return ord;
    }

    public void updateEntityFromDto(Order order, OrderDto orderDto, Branch originBranch, Branch destinationBranch, List<Contact> contacts, List<User> couriers){
        order.setClient(userMapper.toEntity(orderDto.getClient()));
        order.setOriginBranch(originBranch);
        order.setDestinationBranch(destinationBranch);
        order.setContacts(contacts);
        order.setCouriers(couriers);
        order.setDeliveryDate(orderDto.getDeliveryDate());
        order.setReceiverName(orderDto.getReceiverName());
        order.setReceiverPhone(orderDto.getReceiverPhone());
        order.setDestinationAddress(orderDto.getDestinationAddress());
    }

}
