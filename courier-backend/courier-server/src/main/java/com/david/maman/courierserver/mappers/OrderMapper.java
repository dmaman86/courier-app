package com.david.maman.courierserver.mappers;

import java.util.List;
import java.util.stream.Collectors;

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

    public OrderDto toDto(Order order){
        return OrderDto.builder()
                    .id(order.getId())
                    .client(userMapper.toClientDto(order.getClient(), getClientContact(order)))
                    .originOffice(officeMapper.toDto(order.getOriginOffice()))
                    .originBranch(branchMapper.toDto(order.getOriginBranch()))
                    .destinationOffice(officeMapper.toDto(order.getDestinationOffice()))
                    .destinationBranch(branchMapper.toDto(order.getDestinationBranch()))
                    .contacts(order.getContacts().stream()
                                .map(contactMapper::toDto)
                                .collect(Collectors.toList()))
                    .couriers(order.getCouriers().stream()
                                .map(userMapper::toDto)
                                .collect(Collectors.toList()))
                    .deliveryDate(order.getDeliveryDate())
                    .receiverName(order.getReceiverName())
                    .receiverPhone(order.getReceiverPhone())
                    .destinationAddress(order.getDestinationAddress())
                    .currentStatus(toOrderStatusDto(orderStatusHistoryService.getCurrentStatus(order.getId())))
                    .statusHistory(orderStatusHistoryService.getOrderStatusHistory(order.getId()).stream()
                                    .map(this::toOrderStatusDto)
                                    .collect(Collectors.toList()))
                    .build();
    }


    public Order toEntity(OrderDto orderDto, User client, Office originOffice, Branch originBranch, Office destinationOffice, Branch destinationBranch, List<Contact> contacts, List<User> couriers){
        return Order.builder()
                    .client(client)
                    .originOffice(originOffice)
                    .originBranch(originBranch)
                    .destinationOffice(destinationOffice)
                    .destinationBranch(destinationBranch)
                    .contacts(contacts)
                    .couriers(couriers)
                    .deliveryDate(orderDto.getDeliveryDate())
                    .receiverName(orderDto.getReceiverName())
                    .receiverPhone(orderDto.getReceiverPhone())
                    .destinationAddress(orderDto.getDestinationAddress())
                    .isDelivered(false)
                    .build();
    }

    private Contact getClientContact(Order order){
        return order.getContacts().stream()
                    .filter(contact -> contact.getOffice().equals(order.getOriginOffice()) && contact.getBranches().contains(order.getOriginBranch()))
                    .findFirst()
                    .orElse(null);
    }

    private OrderStatusDto toOrderStatusDto(OrderStatusHistory history){
        return OrderStatusDto.builder()
                    .status(statusMapper.toDto(history.getStatus()))
                    .admin(userMapper.toDto(history.getAdmin()))
                    .timestamp(history.getTimestamp())
                    .build();
    }

}
