package com.courier.authservice.config.filters;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.courier.authservice.config.security.CustomUserDetails;
import com.courier.authservice.exception.PublicKeyException;
import com.courier.authservice.service.BlackListService;
import com.courier.authservice.service.JwtService;
import com.courier.authservice.service.RedisKeyService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

  @Autowired private JwtService jwtService;

  @Autowired private RedisKeyService redisKeyService;

  @Autowired private BlackListService blackListService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    if (!redisKeyService.isKeysLoaded()) {
      throw new PublicKeyException("Public key is not available");
    }
    String requestURI = request.getRequestURI();
    String token = null;
    boolean isValidToken = false;
    if (requestURI.equals("/api/credential/refresh-token")) {
      token = extractTokenFromCookies(request, "refreshToken");
      isValidToken = token != null && jwtService.isRefreshTokenValid(token);
    } else {
      token = extractTokenFromCookies(request, "accessToken");
      isValidToken = token != null && jwtService.isTokenValid(token);
    }
    if (token == null) {
      chain.doFilter(request, response);
      return;
    }

    if (token != null && !isValidToken) {
      throw new IllegalStateException("Token is not valid");
    }
    logger.info("Token: {}", token);
    CustomUserDetails userDetails = jwtService.getUserDetails(token);
    if (blackListService.isUserInBlackList(userDetails.getId())) {
      throw new AccessDeniedException("You are not allowed to access this resource");
    }
    logger.info("User details: {}", userDetails);
    setAuthentication(userDetails);

    chain.doFilter(request, response);
  }

  private void setAuthentication(CustomUserDetails userDetails) {
    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    logger.info("User authenticated: {}", authentication);
    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  private String extractTokenFromCookies(HttpServletRequest request, String cookieName) {
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if (cookieName.equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }
}
