package com.david.maman.authenticationserver.models.dto;


import jakarta.servlet.http.Cookie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Cookie accessTokenCookie;

    private Cookie refreshTokenCookie;
}
