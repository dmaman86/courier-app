package com.courier.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.objects.request.SignInRequest;
import com.courier.authservice.objects.request.SignUpRequest;
import com.courier.authservice.objects.response.AuthResponse;
import com.courier.authservice.service.AuthService;
import com.courier.authservice.service.UserCredentialService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired private AuthService authService;

  @Autowired private UserCredentialService userCredentialService;

  @PostMapping("/signin")
  public ResponseEntity<UserDto> signin(
      @RequestBody SignInRequest signInRequest,
      HttpServletRequest request,
      HttpServletResponse response) {

    String userAgent = request.getHeader(HttpHeaders.USER_AGENT);

    AuthResponse authResponse = authService.signin(signInRequest, userAgent);
    setAuthCookies(response, authResponse);
    return ResponseEntity.ok(authResponse.getUser());
  }

  @PostMapping("/signup")
  public ResponseEntity<Void> signup(@RequestBody SignUpRequest signUpRequest) {
    userCredentialService.signup(signUpRequest);
    return ResponseEntity.noContent().build();
  }

  private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
    response.addCookie(authResponse.getAccessTokenCookie());
    response.addCookie(authResponse.getRefreshTokenCookie());
  }
}
