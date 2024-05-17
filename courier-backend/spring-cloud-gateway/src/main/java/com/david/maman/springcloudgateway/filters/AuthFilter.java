package com.david.maman.springcloudgateway.filters;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

import com.david.maman.springcloudgateway.config.RouterValidator;

import reactor.core.publisher.Mono;

/*@Component
public class AuthFilter extends AbstractGatewayFilterFactory<AuthFilter.Config>{

    private static final Logger logger = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Autowired
    private RouterValidator routerValidator;


    @Override
    public GatewayFilter apply(Config config){
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            logger.info("Request url path: {}", request.getURI().getPath());

            if(routerValidator.isSecured.test(request)){
                return webClientBuilder.build().post()
                        .uri("lb://authentication-server/api/auth/validate")
                        .headers(headers -> headers.putAll(request.getHeaders()))
                        .retrieve()
                        .toBodilessEntity()
                        .flatMap(response -> {
                            if(response.getStatusCode().equals(HttpStatus.OK))
                                return chain.filter(exchange);

                            return this.onError(exchange, "Unauthorized - Invalid token", HttpStatus.UNAUTHORIZED);
                        })
                        .onErrorResume(e -> this.onError(exchange, "Authentication server error", HttpStatus.INTERNAL_SERVER_ERROR));
            }
            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = err.getBytes(StandardCharsets.UTF_8);
        DataBuffer dataBuffer = response.bufferFactory().wrap(bytes);
    
        return response.writeWith(Mono.just(dataBuffer));
    }

    public static class Config{

    }
}*/
