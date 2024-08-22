package com.david.maman.authenticationserver.models.dto;

import org.springframework.http.HttpCookie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private HttpCookie accessTokenCookie;

    private HttpCookie refreshTokenCookie;
}
