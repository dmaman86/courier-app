package com.david.maman.authenticationserver.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.models.dto.LoginDto;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.services.AuthService;
import com.david.maman.authenticationserver.services.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenRepository tokenRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDto loginDto) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
            );

            if(!isAuthenticated(authentication))
                throw new RuntimeException("Error: User not authenticated");

            CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(authentication.getName());

           return ResponseEntity.ok(authService.login(user));
        }catch(BadCredentialsException e){
            return ResponseEntity.badRequest().body("Error: Bad credentials");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String header){
        try{
            final String refreshToken = getTokenHeader(header);
            var user = getUserToken(refreshToken);
            return ResponseEntity.ok(authService.refreshToken(user, refreshToken));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String header){
        try{
            final String token = getTokenHeader(header);
            var user = getUserToken(token);
            var isTokenValid = tokenRepository.findByToken(token)
                                        .map(t -> !t.getIsExpired() && !t.getIsRevoked())
                                        .orElse(false);
            if(!jwtService.validateToken(token, user) || !isTokenValid)
                throw new RuntimeException("Error: Invalid token");
            return ResponseEntity.ok().build();
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }

    private String getTokenHeader(String header) throws RuntimeException{
        if(header == null || header.isBlank() || !header.startsWith("Bearer ")){
            throw new RuntimeException("Error: Refresh token is missing");
        }
        return header.substring(7);
    }

    private CustomUserDetails getUserToken(String token) throws RuntimeException{
        final String userEmail = jwtService.extractUserName(token);
        if(userEmail == null){
            throw new RuntimeException("Error: Invalid refresh token");
        }
        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(userEmail);
        if(!jwtService.validateToken(token, user)){
            throw new RuntimeException("Error: Invalid refresh token");
        }
        return user;
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null &&
                !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.isAuthenticated();
    }

}
