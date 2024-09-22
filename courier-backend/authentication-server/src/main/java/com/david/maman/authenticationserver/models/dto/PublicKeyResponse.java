package com.david.maman.authenticationserver.models.dto;

import java.security.PublicKey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicKeyResponse {

    private String correlationId;
    private String publicKey;
}
