package com.david.maman.courierserver.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorLogDto {

    private String message;
    private String details;
    private String path;
}
