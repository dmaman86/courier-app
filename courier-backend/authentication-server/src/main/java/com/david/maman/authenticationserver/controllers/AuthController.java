package com.david.maman.authenticationserver.controllers;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.authenticationserver.exceptions.TokenValidationException;
import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.models.dto.LoginDto;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.services.AuthService;
import com.david.maman.authenticationserver.services.JwtService;
import com.google.common.base.Strings;

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
    private final UserCredentialsRepository userCredentialsRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDto loginDto) {
        UserCredentials credentials = getCredentials(loginDto);

        validateCredentials(credentials, loginDto.getPassword());

        Authentication authentication = performAuthentication(loginDto, credentials);

        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(authentication.getName());

        return ResponseEntity.ok(authService.login(user));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserCredentials(@RequestBody UserCredentialsPassword userCredentialsPassword){
        UserCredentials credentials = userCredentialsRepository.findByUserEmail(userCredentialsPassword.getEmail())
                                                .orElseThrow(() -> new RuntimeException("Error: User not found"));

        if(!credentials.getFirstConnection() || userCredentialsPassword.getPassword() == null || userCredentialsPassword.getPassword().isBlank()){
            throw new RuntimeException("Error: User can't update password");
        }
        authService.updateUserCredentials(userCredentialsPassword);
        return ResponseEntity.ok("Password was set successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String header, Authentication authentication){
        final String refreshToken = getTokenHeader(header);
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(authService.refreshToken(user, refreshToken));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String header, Authentication authentication){
        final String token = getTokenHeader(header);
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        if (!jwtService.validateToken(token, user))
            throw new TokenValidationException("Invalid token");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication){
        try{
            if(authentication != null){
                CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
                authService.logout(user);
            }
            
            return ResponseEntity.ok().body("User logged out successfully");
        }finally{
            SecurityContextHolder.clearContext();
        }
    }

    private String getTokenHeader(String header) throws RuntimeException{
        if(Strings.isNullOrEmpty(header) || !header.startsWith("Bearer ")){
            throw new RuntimeException("Error: Refresh token is missing");
        }
        return header.replace("Bearer ", "");
    }

    private UserCredentials getCredentials(LoginDto loginDto) throws RuntimeException{
        if(loginDto.getEmail() != null && !loginDto.getEmail().isBlank()){
            return userCredentialsRepository.findByUserEmail(loginDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Error: User not found"));
        }else if(loginDto.getPhone() != null && !loginDto.getPhone().isBlank()){
            return userCredentialsRepository.findByUserPhone(loginDto.getPhone())
                    .orElseThrow(() -> new RuntimeException("Error: User not found"));
        }
        throw new RuntimeException("Error: User not found");
    }

    private void validateCredentials(UserCredentials credentials, String password){
        if(credentials.getFirstConnection() && credentials.getPassword().isBlank()){
            throw new RuntimeException("Error: User must set a password");
        }
    }

    private Authentication performAuthentication(LoginDto loginDto, UserCredentials credentials){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDto.getEmail() != null ? loginDto.getEmail() : loginDto.getPhone(), loginDto.getPassword())
        );

        if(!isAuthenticated(authentication))
            throw new RuntimeException("Error: User not authenticated");
        return authentication;
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null &&
                !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.isAuthenticated();
    }

}
