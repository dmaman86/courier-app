package com.david.maman.courierserver.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.OrderStatusDto;
import com.david.maman.courierserver.models.entities.OrderStatusHistory;

@Component
public class OrderStatusHistoryMapper {

    @Autowired
    private StatusMapper statusMapper;

    @Autowired
    private UserMapper userMapper;

    public OrderStatusDto toDto(OrderStatusHistory orderStatusHistory){
        return OrderStatusDto.builder()
                            .status(statusMapper.toDto(orderStatusHistory.getStatus()))
                            .admin(userMapper.toDto(orderStatusHistory.getAdmin()))
                            .timestamp(orderStatusHistory.getTimestamp())
                            .build();
    }

    public OrderStatusHistory toEntity(OrderStatusDto orderStatusDto){
        return OrderStatusHistory.builder()
                                .status(statusMapper.toEntity(orderStatusDto.getStatus()))
                                .admin(userMapper.toEntity(orderStatusDto.getAdmin()))
                                .timestamp(orderStatusDto.getTimestamp())
                                .build();
    }

}
