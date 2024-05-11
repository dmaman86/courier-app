package com.david.maman.courierserver.configuration;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.david.maman.courierserver.helpers.CustomUserDetails;
import com.david.maman.courierserver.helpers.UserDetatailsServiceImpl;
import com.david.maman.courierserver.services.JwtService;
import com.google.common.base.Strings;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthFilter extends OncePerRequestFilter{

    private static Logger logger = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetatailsServiceImpl userDetailsService;

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException{
        
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        logger.info("Authorization Header: { " + authHeader + " }");

        if(Strings.isNullOrEmpty(authHeader) || !authHeader.startsWith("Bearer ")){
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.replace("Bearer ", "");

        try {
            String userEmail = jwtService.extractUserName(token);
            if(userEmail != null)
                authenticateUser(token, userEmail, request);

        } catch (SignatureException | MalformedJwtException e) {
            throw new JwtException(e.getMessage());
        }
        chain.doFilter(request, response);

    }

    private void authenticateUser(String token, String userEmail, HttpServletRequest request) throws SignatureException{
        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(userEmail);

        if(jwtService.validateToken(token, user)){
            Authentication authToken = new UsernamePasswordAuthenticationToken(
                user,
                null,  
                user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }else{
            throw new SignatureException("Invalid or expired JWT token");
        }
    }

}
