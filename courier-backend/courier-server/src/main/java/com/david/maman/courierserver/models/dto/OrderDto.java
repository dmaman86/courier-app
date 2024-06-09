package com.david.maman.courierserver.models.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderDto {

    private Long id;
    private UserDto client;
    private BranchDto originBranch;
    private BranchDto destinationBranch;
    private List<ContactDto> contacts;
    private List<UserDto> couriers;

    private String deliveryDate;
    private String receiverName;
    private String receiverPhone;
    private String destinationAddress;

    private StatusDto currentStatus;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
