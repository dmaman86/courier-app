package com.david.maman.courierserver.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicKeyResponse {

    private String correlationId;
    private String publicKey;
}
