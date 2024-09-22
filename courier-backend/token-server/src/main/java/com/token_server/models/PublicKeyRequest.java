package com.token_server.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicKeyRequest {

    private String correlationId;
    private String serverName;
}
