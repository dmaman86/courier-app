package com.courier.apigateway.config;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.courier.apigateway.exceptions.PublicKeyException;
import com.courier.apigateway.exceptions.TokenValidationException;
import com.courier.apigateway.objects.dto.ErrorLogDto;
import com.courier.apigateway.objects.dto.SecurityEventDto;
import com.courier.apigateway.objects.enums.ErrorSeverity;
import com.courier.apigateway.service.BlackListService;
import com.courier.apigateway.service.EventProducerService;
import com.courier.apigateway.service.JwtService;
import com.courier.apigateway.service.RedisKeysService;

import reactor.core.publisher.Mono;

@Component
public class JwtValidationFilter implements GlobalFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtValidationFilter.class);

  @Autowired private BlackListService blackListService;

  @Autowired private JwtService jwtService;

  @Autowired private EventProducerService eventProducerService;

  @Autowired private RedisKeysService redisKeysService;

  private static final List<String> OPEN_ENDPOINTS =
      List.of("/api/auth/signin", "/api/auth/signup");

  private static final String REFRESH_TOKEN_ENDPOINT = "/api/credential/refresh-token";

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

    if (!redisKeysService.hasValidPublicKey()) {
      return unauthorizedResponse(exchange, "Public key is not available");
    }

    if (!isOpenEndpoint(exchange.getRequest())) {
      ServerHttpRequest request = exchange.getRequest();
      String requestPath = request.getURI().getPath();
      try {
        String token =
            (requestPath.equals(REFRESH_TOKEN_ENDPOINT))
                ? extractTokenFromCookies(request, "refreshToken")
                : extractTokenFromCookies(request, "accessToken");

        if (token == null || token.isEmpty() || !jwtService.isTokenValid(token)) {
          return unauthorizedResponse(exchange, "Invalid token");
        }

        String clientUserAgent = request.getHeaders().getFirst(HttpHeaders.USER_AGENT);

        SecurityEventDto securityEventDto = jwtService.getSecurityEvent(token);

        if (blackListService.isUserBlackListed(securityEventDto.getUserId())) {
          sendSecurityAlert(securityEventDto, requestPath, "User in blacklisted");
          return unauthorizedResponse(exchange, "User is not authorized");
        }

        if (isSuspiciousRequest(securityEventDto, clientUserAgent)) {
          logger.warn(
              "Detected malicious request from user: {} with ip: {} and user agent: {}",
              securityEventDto.getUserId(),
              clientUserAgent);
          blackListService.handleUserIdEvent(securityEventDto.getUserId());
          sendSecurityAlert(securityEventDto, requestPath, "User agent mismatch");
          return unauthorizedResponse(exchange, "Detected malicious request");
        }

        return chain.filter(exchange);

      } catch (TokenValidationException e) {
        logger.warn("Token validation exception: {}", e.getMessage());
        return unauthorizedResponse(exchange, e.getMessage());
      } catch (PublicKeyException e) {
        logger.error("Public key exception: {}", e.getMessage());
        return unauthorizedResponse(exchange, e.getMessage());
      } catch (RuntimeException e) {
        logger.error("Runtime exception: {}", e.getMessage());
        return unauthorizedResponse(exchange, e.getMessage());
      }
    }
    return chain.filter(exchange);
  }

  private void sendSecurityAlert(SecurityEventDto securityEventDto, String path, String reason) {
    ErrorLogDto errorLog =
        ErrorLogDto.builder()
            .timestamp(
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
            .status(401) // Unauthorized
            .error("Malicious Request Detected")
            .message(
                "User with id: "
                    + securityEventDto.getUserId()
                    + " tried to access: "
                    + path
                    + " with reason: "
                    + reason)
            .path(path)
            .exception("SecurityViolationException")
            .severity(ErrorSeverity.CRITICAL)
            .build();

    eventProducerService.publishErrorLog(errorLog);
    logger.warn("Security alert event send to error-service: {}", errorLog);
  }

  private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String reason) {
    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
    return exchange.getResponse().setComplete();
  }

  private String extractTokenFromCookies(ServerHttpRequest request, String cookieName) {
    return Optional.ofNullable(request.getCookies().getFirst(cookieName))
        .map(HttpCookie::getValue)
        .orElse(null);
  }

  private String extractTokenFromCookies(ServerHttpRequest request) {
    return Optional.ofNullable(request.getCookies().getFirst("accessToken"))
        .map(HttpCookie::getValue)
        .orElse(null);
  }

  private boolean isSuspiciousRequest(SecurityEventDto securityEventDto, String clientUserAgent) {
    return !securityEventDto.getUserAgent().equals(clientUserAgent);
  }

  private boolean isOpenEndpoint(ServerHttpRequest request) {
    String path = request.getURI().getPath();
    boolean isOpen = OPEN_ENDPOINTS.stream().anyMatch(path::startsWith);

    logger.info("Path: {} is open: {}", path, isOpen);
    return isOpen;
  }
}
