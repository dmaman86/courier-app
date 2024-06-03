package com.david.maman.courierserver.models.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusDto {

    private StatusDto status;
    private UserDto admin;
    private LocalDateTime timestamp;
}
