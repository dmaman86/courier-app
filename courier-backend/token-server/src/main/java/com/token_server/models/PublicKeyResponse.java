package com.token_server.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicKeyResponse {

    private String correlationId;
    private String publicKey;
}
