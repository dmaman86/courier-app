package com.david.maman.authenticationserver.controllers;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.models.dto.LoginDto;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.services.AuthService;
import com.google.common.base.Strings;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDto loginDto) {
        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByEmailOrPhone(loginDto.getEmail(), loginDto.getPhone());

        if(user.getCredentials().getFirstConnection()){
            // throw new RuntimeException("Error: User must set a password");
            throw new BadCredentialsException("User must set a password");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), loginDto.getPassword())
        );
        if(!isAuthenticated(authentication))
            throw new BadCredentialsException("Error: Invalid username or password");

        return ResponseEntity.ok(authService.login(user));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> updateUserCredentials(@RequestBody UserCredentialsPassword userCredentialsPassword){
        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByEmailOrPhone(userCredentialsPassword.getEmail(), userCredentialsPassword.getPhone());

        if(!user.getCredentials().getFirstConnection() || isEmpty(userCredentialsPassword.getPasswordOne()) || isEmpty(userCredentialsPassword.getPasswordTwo())){
            throw new RuntimeException("Error: User can't update password");
        }
        if(!isSameValue(userCredentialsPassword.getPasswordOne(), userCredentialsPassword.getPasswordTwo())){
            throw new RuntimeException("Error: Passwords don't match");
        }
        authService.updateUserCredentials(user.getCredentials(), userCredentialsPassword);
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), userCredentialsPassword.getPasswordOne())
        );

        if(!isAuthenticated(authentication))
            throw new RuntimeException("Error: User not authenticated");

        return ResponseEntity.ok(authService.login(user));
    }

    private Boolean isEmpty(String value){
        return Strings.isNullOrEmpty(value) || value.isBlank();
    }

    private Boolean isSameValue(String valueOne, String valueTwo){
        return valueOne.equals(valueTwo);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String header, Authentication authentication){
        final String refreshToken = getTokenHeader(header);
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(authService.refreshToken(user, refreshToken));
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

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null &&
                !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.isAuthenticated();
    }

}
