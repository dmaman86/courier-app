package com.courier.apigateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

  @Bean
  public RouteLocator routes(RouteLocatorBuilder builder, RedisRateLimiter redisRateLimiter) {
    return builder
        .routes()
        .route(
            "auth-service",
            r ->
                r.path("/api/auth/**", "/api/credential/**")
                    .filters(
                        f ->
                            f.requestRateLimiter(
                                c ->
                                    c.setRateLimiter(redisRateLimiter)
                                        .setKeyResolver(ipKeyResolver())))
                    .uri("lb://courier-auth-service"))
        .route(
            "user-service",
            r ->
                r.path("/api/user/**")
                    .filters(
                        f ->
                            f.requestRateLimiter(
                                c ->
                                    c.setRateLimiter(redisRateLimiter)
                                        .setKeyResolver(ipKeyResolver())))
                    .uri("lb://courier-user-service"))
        .route(
            "resource-service",
            r ->
                r.path("/api/resource/**")
                    .filters(
                        f ->
                            f.requestRateLimiter(
                                c ->
                                    c.setRateLimiter(redisRateLimiter)
                                        .setKeyResolver(ipKeyResolver())))
                    .uri("lb://courier-resource-service"))
        .build();
  }

  @Bean
  public KeyResolver ipKeyResolver() {
    return exchange ->
        Mono.just(exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
  }

  @Bean
  public RedisRateLimiter redisRateLimiter() {
    return new RedisRateLimiter(10, 20);
  }
}
