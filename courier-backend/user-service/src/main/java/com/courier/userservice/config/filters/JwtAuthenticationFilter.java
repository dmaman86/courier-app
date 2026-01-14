package com.courier.userservice.config.filters;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.courier.userservice.exception.UnauthorizedException;
import com.courier.userservice.objects.dto.UserContext;
import com.courier.userservice.service.BlackListService;
import com.courier.userservice.service.JwtService;
import com.courier.userservice.service.RedisService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
  @Autowired private JwtService jwtService;

  @Autowired private RedisService redisService;

  @Autowired private BlackListService blackListService;

  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    if (!redisService.hasKeys()) throw new UnauthorizedException("Public key not loaded");

    if (request.getRequestURI().equals("/api/user/find-by-email-or-phone")) {
      String requestApiKey = request.getHeader("X-Api-Key");
      String storedApiKey = redisService.getAuthServiceSecret();

      if (!storedApiKey.equals(requestApiKey)) {
        throw new UnauthorizedException("Invalid API Key for auth-service");
      }
      filterChain.doFilter(request, response);
      return;
    }

    String token = extractTokenFromCookies(request);
    if (token != null && jwtService.isTokenValid(token)) {
      UserContext user = jwtService.getUserContext(token);
      logger.info("User {} is authenticated", user);

      if (blackListService.isUserBlackListed(user.getId())) {
        SecurityContextHolder.clearContext();
        throw new AccessDeniedException("User is disabled");
      }

      UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

      logger.info("Authenticated user: {}", authentication);

      SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    filterChain.doFilter(request, response);
  }

  private String extractTokenFromCookies(HttpServletRequest request) {
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("accessToken".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }
}
