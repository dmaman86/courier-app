package com.david.maman.authenticationserver.configuration.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.david.maman.authenticationserver.configuration.ExceptionHandlerFilter;
import com.david.maman.authenticationserver.configuration.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;


@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final ExceptionHandlerFilter exceptionHandlerFilter;


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .addFilterBefore(exceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(jwtAuthenticationFilter, ExceptionHandlerFilter.class)
            .authorizeHttpRequests(request -> request
                .requestMatchers("/api/auth/signin", "/api/auth/signup").permitAll()
                .requestMatchers("/api/auth/**").authenticated()
                .anyRequest().authenticated())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider);
            

        return http.build();
    }

}
