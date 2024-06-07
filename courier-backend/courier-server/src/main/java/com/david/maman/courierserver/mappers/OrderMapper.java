package com.david.maman.courierserver.mappers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.ContactDto;
import com.david.maman.courierserver.models.dto.OrderDto;
import com.david.maman.courierserver.models.dto.OrderStatusDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.services.OrderService;
import com.david.maman.courierserver.services.OrderStatusHistoryService;

@Component
public class OrderMapper {

    private static final Logger logger = LoggerFactory.getLogger(OrderMapper.class);

    @Autowired
    private ContactMapper contactMapper;

    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private StatusMapper statusMapper;

    @Autowired
    private OfficeMapper officeMapper;

    @Autowired
    private BranchMapper branchMapper;

    @Autowired
    private OrderStatusHistoryMapper orderStatusHistoryMapper;


    public OrderDto toDto(Order order){

        OrderStatusHistory currenStatusHistory = order.getStatusHistory().stream()
                    .max(Comparator.comparing(OrderStatusHistory::getTimestamp))
                    .orElse(null);

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
                    .currentStatus(currenStatusHistory != null ? statusMapper.toDto(currenStatusHistory.getStatus()) : null)
                    .statusHistory(orderStatusHistoryService.getOrderStatusHistory(order.getId()).stream()
                                    .map(this::toOrderStatusDto)
                                    .collect(Collectors.toList()))
                    .build();
    }

    public Order toEntity(OrderDto orderDto){

        List<OrderStatusHistory> statusHistory = orderDto.getStatusHistory() != null ?
            orderDto.getStatusHistory().stream().map(orderStatusHistoryMapper::toEntity).collect(Collectors.toList()) :
            new ArrayList<>();

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
                    .statusHistory(statusHistory)
                    .isDelivered(false)
                    .build();

    }


    public Order toEntity(OrderDto orderDto, Branch originBranch, Branch destinationBranch, List<Contact> contacts, List<User> couriers){

        List<OrderStatusHistory> statusHistory = orderDto.getStatusHistory() != null ?
            orderDto.getStatusHistory().stream().map(orderStatusHistoryMapper::toEntity).collect(Collectors.toList()) :
            new ArrayList<>();

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
                    .statusHistory(statusHistory)
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

    private OrderStatusDto toOrderStatusDto(OrderStatusHistory history){
        return OrderStatusDto.builder()
                    .status(statusMapper.toDto(history.getStatus()))
                    .admin(userMapper.toDto(history.getAdmin()))
                    .timestamp(history.getTimestamp())
                    .build();
    }

}
