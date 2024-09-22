package com.token_server.models;

import com.token_server.models.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRequest {

    private String correlationId;
    private User user;
    private long expiresIn;
    private String replyTo;
}
