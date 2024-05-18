package com.david.maman.springcloudgateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class GatewayConfig {

        @Bean
        RouteLocator routes(RouteLocatorBuilder builder){
                return builder.routes()
                                .route("authentication-server", r -> r.path("/api/auth/**")
                                        .uri("lb://authentication-server"))
                                .route("product-server", r -> r.path("/api/courier/**")
                                        .uri("lb://courier-server"))
                                .build();
        }

}
