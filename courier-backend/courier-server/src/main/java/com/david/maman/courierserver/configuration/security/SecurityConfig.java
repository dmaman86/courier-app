package com.david.maman.courierserver.configuration.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.david.maman.courierserver.configuration.AuthFilter;
import com.david.maman.courierserver.configuration.ExceptionHandlerFilter;

import org.springframework.security.authentication.AuthenticationProvider;

import lombok.RequiredArgsConstructor;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthFilter authFilter;
    private final AuthenticationProvider authenticationProvider;
    private final ExceptionHandlerFilter exceptionHandlerFilter;
    
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http.csrf(AbstractHttpConfigurer::disable)
            .addFilterBefore(exceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(authFilter, ExceptionHandlerFilter.class)
            .authorizeHttpRequests(request -> request 
                .requestMatchers("/api/courier/**").authenticated())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider);

        return http.build();
    }
}
