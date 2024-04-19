package com.david.maman.springcloudgateway.config;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.david.maman.springcloudgateway.helpers.ApiError;
import com.david.maman.springcloudgateway.service.JwtService;

import reactor.core.publisher.Mono;

@Component
public class AuthFilter extends AbstractGatewayFilterFactory<AuthFilter.Config>{

    private static final Logger logger = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private RouterValidator routerValidator;

    @Autowired
    private JwtService jwtService;

    @Override
    public GatewayFilter apply(Config config){
        return ((exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            logger.info("Request url path: {}", request.getURI().getPath());

            if(routerValidator.isSecured.test(request)){
                try {
                    String token = this.getTokenHeader(request);
                    logger.info("Token: {}", token);
                    if(jwtService.isTokenExpired(token)){
                        return this.onError(exchange, "Authentication token is expired", HttpStatus.UNAUTHORIZED);
                    }
                } catch (Exception e) {
                    return this.onError(exchange, e.getMessage(), HttpStatus.UNAUTHORIZED);
                }
            }

            return chain.filter(exchange);
        });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        ApiError apiError = ApiError.builder()
                .status(httpStatus.value())
                .message(err)
                .timestamp(System.currentTimeMillis())
                .build();

        byte[] bytes = apiError.toString().getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);

        return response.writeWith(Mono.just(buffer));
    }

    private String getTokenHeader(ServerHttpRequest request) throws RuntimeException{
        final String authHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
        if(!isAuthHeaderValid(authHeader)){
            throw new RuntimeException("Invalid Authorization header");
        }
        return authHeader.substring(7);
    }

    private Boolean isAuthHeaderValid(String header){
        return !isEmpty(header) && header.startsWith("Bearer ");
    }

    private Boolean isEmpty(String str){
        return str == null || str.isEmpty();
    }

    public static class Config{

    }
}
