package com.courier.authservice.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.courier.authservice.config.security.CustomUserDetails;
import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.objects.request.SignInRequest;
import com.courier.authservice.objects.response.AuthResponse;
import com.courier.authservice.service.AuthService;
import com.courier.authservice.service.JwtService;

import jakarta.servlet.http.Cookie;

@Service
public class AuthServiceImpl implements AuthService {

  private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

  @Autowired private JwtService jwtService;

  @Autowired private AuthenticationManager authenticationManager;

  @Autowired private UserDetailsServiceImpl userDetailsService;

  @Override
  public AuthResponse signin(SignInRequest signInRequest, String userAgent) {
    String username =
        signInRequest.getEmail() != null
            ? signInRequest.getEmail()
            : signInRequest.getPhoneNumber();

    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, signInRequest.getPassword()));

    CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

    logger.info("Custom user details: {}", customUserDetails);

    // UserDto user = getUserDtoFromCustomUserDetails(customUserDetails);

    UserDto user = userDetailsService.getUserFromService(null, customUserDetails.getPhoneNumber());
    String accessToken =
        jwtService.generateToken(
            customUserDetails, jwtService.getAccessTokenExpirationTime(), userAgent);
    String refreshToken =
        jwtService.generateToken(
            customUserDetails, jwtService.getRefreshTokenExpirationTime(), userAgent);

    jwtService.saveRefreshToken(refreshToken, customUserDetails.getId());

    return AuthResponse.builder()
        .accessTokenCookie(
            createCookie("accessToken", accessToken, jwtService.getAccessTokenExpirationTime()))
        .refreshTokenCookie(
            createCookie("refreshToken", refreshToken, jwtService.getRefreshTokenExpirationTime()))
        .user(user)
        .build();
  }

  @Override
  public AuthResponse logout(Long userId) {
    jwtService.deleteUserToken(userId);
    return AuthResponse.builder()
        .accessTokenCookie(createCookie("accessToken", "", 0))
        .refreshTokenCookie(createCookie("refreshToken", "", 0))
        .user(null)
        .build();
  }

  @Override
  public AuthResponse refreshToken(
      CustomUserDetails userDetails, Cookie refreshTokenCookie, String userAgent) {

    // UserDto user = getUserDtoFromCustomUserDetails(userDetails);

    UserDto user = userDetailsService.getUserFromService(userDetails.getUsername(), null);
    String newAccessToken =
        jwtService.generateToken(userDetails, jwtService.getAccessTokenExpirationTime(), userAgent);

    Date refreshTokenExpiration = jwtService.extractExpiration(refreshTokenCookie.getValue());
    long timeToExpiration = refreshTokenExpiration.getTime() - System.currentTimeMillis();

    String newRefreshToken = refreshTokenCookie.getValue();
    long refreshTokenExpirationTime = timeToExpiration;

    if (timeToExpiration < jwtService.getAccessTokenExpirationTime()) {
      newRefreshToken =
          jwtService.generateToken(
              userDetails, jwtService.getRefreshTokenExpirationTime(), userAgent);
      jwtService.saveRefreshToken(newRefreshToken, userDetails.getId());
      refreshTokenExpirationTime = jwtService.getRefreshTokenExpirationTime();
    }

    return AuthResponse.builder()
        .accessTokenCookie(
            createCookie("accessToken", newAccessToken, jwtService.getAccessTokenExpirationTime()))
        .refreshTokenCookie(
            createCookie("refreshToken", newRefreshToken, refreshTokenExpirationTime))
        .user(user)
        .build();
  }

  // private UserDto getUserDtoFromCustomUserDetails(CustomUserDetails customUserDetails) {
  //   return UserDto.builder()
  //       .id(customUserDetails.getId())
  //       .email(customUserDetails.getUsername())
  //       .phoneNumber(customUserDetails.getPhoneNumber())
  //       .fullName(customUserDetails.getFullName())
  //       .enabled(customUserDetails.isEnabled())
  //       .roles(
  //           customUserDetails.getAuthorities().stream()
  //               .map(auth -> RoleDto.builder().name(auth.getAuthority()).build())
  //               .collect(Collectors.toSet()))
  //       .build();
  // }

  private Cookie createCookie(String tokenType, String token, long expirationTime) {
    Cookie cookie = new Cookie(tokenType, token);
    cookie.setHttpOnly(true);
    cookie.setSecure(false); // change to true in production
    cookie.setMaxAge((int) (expirationTime / 1000)); // convert milliseconds to seconds
    cookie.setPath("/");
    return cookie;
  }
}
