package com.david.maman.springcloudgateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    // @Autowired
    // private AuthenticationFilter authenticationFilter;

    @Autowired
    private AuthFilter authenticationFilter;

    @Bean
    RouteLocator routes(RouteLocatorBuilder builder){
        return builder.routes()
                    .route("authentication-server", r -> r.path("/api/auth/**")
                            .filters(f -> f.filter(authenticationFilter.apply(new AuthFilter.Config())))
                            .uri("lb://authentication-server"))
                    .build();
    }

}
