package com.david.maman.springcloudgateway.config;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// import com.david.maman.springcloudgateway.filters.AuthFilter;


@Configuration
public class GatewayConfig {

        /*@Autowired
        private AuthFilter authFilter;
    
        @Bean
        RouteLocator routes(RouteLocatorBuilder builder){
            return builder.routes()
                        .route("authentication-server", r -> r.path("/api/auth/**")
                                .filters(f -> f.filter(authFilter.apply(new AuthFilter.Config())))
                                .uri("lb://authentication-server"))
                        .route("product-server", r -> r.path("/api/courier/**")
                                .filters(f -> f.filter(authFilter.apply(new AuthFilter.Config())))
                                .uri("lb://courier-server"))
                        .build();
        }*/

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
