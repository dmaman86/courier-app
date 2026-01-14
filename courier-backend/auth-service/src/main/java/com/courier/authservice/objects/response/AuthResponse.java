package com.courier.authservice.objects.response;

import com.courier.authservice.objects.dto.UserDto;

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
  private UserDto user;
}
