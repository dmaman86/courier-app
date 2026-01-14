package com.courier.authservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.courier.authservice.config.security.CustomUserDetails;
import com.courier.authservice.objects.request.UpdateUserCredential;
import com.courier.authservice.objects.response.AuthResponse;
import com.courier.authservice.service.AuthService;
import com.courier.authservice.service.UserCredentialService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/credential")
public class UserCredentialController {

  private static final Logger logger = LoggerFactory.getLogger(UserCredentialController.class);
  @Autowired private UserCredentialService userCredentialService;

  @Autowired private AuthService authService;

  @PostMapping("/update-credential")
  public ResponseEntity<String> updateCredential(
      @RequestBody UpdateUserCredential updateUserCredential, Authentication authentication) {

    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

    if (!userDetails.getId().equals(updateUserCredential.getUserId())) {
      throw new AccessDeniedException("Your are not allowed to change another user's password");
    }

    userCredentialService.updateCredential(updateUserCredential);
    return ResponseEntity.ok("Password updated successfully");
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(Authentication authentication, HttpServletResponse response) {
    Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
    AuthResponse authResponse = authService.logout(userId);
    setAuthCookies(response, authResponse);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<Void> refreshToken(
      @CookieValue("refreshToken") Cookie refreshTokenCookie,
      Authentication authentication,
      HttpServletRequest request,
      HttpServletResponse response) {

    String userAgent = request.getHeader(HttpHeaders.USER_AGENT);

    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    logger.info("User details: {}", userDetails);
    AuthResponse authResponse =
        authService.refreshToken(userDetails, refreshTokenCookie, userAgent);
    logger.info("Auth response: {}", authResponse);
    setAuthCookies(response, authResponse);
    return ResponseEntity.noContent().build();
  }

  private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
    response.addCookie(authResponse.getAccessTokenCookie());
    response.addCookie(authResponse.getRefreshTokenCookie());
  }
}
