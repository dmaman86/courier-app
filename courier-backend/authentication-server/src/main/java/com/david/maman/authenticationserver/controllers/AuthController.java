package com.david.maman.authenticationserver.controllers;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.LoginDto;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.services.AuthService;
import com.google.common.base.Strings;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        CustomUserDetails user = loadUser(loginDto.getEmail(), loginDto.getPhone());

        if(user.getCredentials().getFirstConnection()){
            throw new RuntimeException("User must set a password");
        }

        authenticate(user.getUsername(), loginDto.getPassword());
        setAuthCookies(response, authService.generateAuthTokens(user));

        return ResponseEntity.ok().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> updateUserCredentials(@RequestBody UserCredentialsPassword userCredentialsPassword, HttpServletResponse response){
        CustomUserDetails user = loadUser(userCredentialsPassword.getEmail(), userCredentialsPassword.getPhone());

        if(!user.getCredentials().getFirstConnection() ||
            isEmpty(userCredentialsPassword.getPasswordOne()) ||
            isEmpty(userCredentialsPassword.getPasswordTwo()) ||
            !isSameValue(userCredentialsPassword.getPasswordOne(), userCredentialsPassword.getPasswordTwo())){
            throw new RuntimeException("Error: User can't update password");
        }

        authService.updateUserCredentials(user.getCredentials(), userCredentialsPassword);
        authenticate(user.getUsername(), userCredentialsPassword.getPasswordOne());
        setAuthCookies(response, authService.generateAuthTokens(user));

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(Authentication authentication, HttpServletResponse response){
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        setAuthCookies(response, authService.generateAuthTokens(user));

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication, HttpServletResponse response){
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        setAuthCookies(response, authService.logout(user));
        SecurityContextHolder.clearContext();

        return ResponseEntity.noContent().build();
    }

    private CustomUserDetails loadUser(String email, String phone){
        return (CustomUserDetails) userDetailsService.loadUserByEmailOrPhone(email, phone);
    }

    private void authenticate(String username, String password){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        if(!isAuthenticated(authentication))
            throw new BadCredentialsException("Error: Invalid username or password");
    }

    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse){
        response.addHeader(HttpHeaders.SET_COOKIE, authResponse.getAccessTokenCookie().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, authResponse.getRefreshTokenCookie().toString());
    }

    private Boolean isEmpty(String value){
        return Strings.isNullOrEmpty(value) || value.isBlank();
    }

    private Boolean isSameValue(String valueOne, String valueTwo){
        return valueOne.equals(valueTwo);
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null &&
                !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.isAuthenticated();
    }

}
