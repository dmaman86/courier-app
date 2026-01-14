package com.courier.authservice.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.courier.authservice.config.filters.ExceptionHandlerFilter;
import com.courier.authservice.config.filters.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired private JwtAuthenticationFilter jwtAuthenticationFilter;

  @Autowired private ExceptionHandlerFilter exceptionHandlerFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            request ->
                request
                    .requestMatchers("/api/auth/signin", "/api/auth/signup")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(exceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterAfter(jwtAuthenticationFilter, ExceptionHandlerFilter.class);

    return http.build();
  }
}
