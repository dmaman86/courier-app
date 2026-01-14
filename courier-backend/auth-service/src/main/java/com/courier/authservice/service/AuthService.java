package com.courier.authservice.service;

import com.courier.authservice.config.security.CustomUserDetails;
import com.courier.authservice.objects.request.SignInRequest;
import com.courier.authservice.objects.response.AuthResponse;

import jakarta.servlet.http.Cookie;

public interface AuthService {

  AuthResponse signin(SignInRequest signInRequest, String userAgent);

  AuthResponse logout(Long userId);

  AuthResponse refreshToken(
      CustomUserDetails userDetails, Cookie refreshTokenCookie, String userAgent);
}
