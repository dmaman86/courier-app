package com.david.maman.courierserver.models.dto;

import java.util.List;

import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Long id;
    private ClientDto client;
    private OfficeInfoDto originOffice;
    private BranchInfoDto originBranch;
    private OfficeInfoDto destinationOffice;
    private BranchInfoDto destinationBranch;
    private List<ContactDto> contacts;
    private List<UserDto> couriers;

    private String deliveryDate;
    private String receiverName;
    private String receiverPhone;
    private String destinationAddress;

    private OrderStatusDto currentStatus;
    private List<OrderStatusDto> statusHistory;
}
