package com.david.maman.errorserver.security;

import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    @Bean
    EurekaValidationFilter eurekaValidationFilter(EurekaDiscoveryClient discoveryClient) {
        return new EurekaValidationFilter(discoveryClient);
    }

}
