package com.david.maman.authenticationserver.configuration;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.david.maman.authenticationserver.exceptions.TokenValidationException;
import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.services.JwtService;
import com.google.common.base.Strings;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    protected static Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain chain) throws ServletException, IOException{
        
        String requestUri = request.getRequestURI();
        String token = null;                        
        if(requestUri.equals("/api/auth/refresh")){
            token = getTokenCookie(request, "refreshToken");
        } else{
            token = getTokenCookie(request, "accessToken");
        }

        
        if(Strings.isNullOrEmpty(token)){
            chain.doFilter(request, response);
            return;
        }

        logger.info("Access Token: { " + token + " }");
        
        try {
            if(!jwtService.isPublicKeyAvailable()){
                throw new IllegalStateException("Public key not available for token validation");
            }

            authenticateUser(token);
        } catch (SignatureException | MalformedJwtException e) {
            throw new JwtException(e.getMessage());
        } catch(IllegalStateException e){
            throw new TokenValidationException(e.getMessage());
        }
        chain.doFilter(request, response);
    }

    private String getTokenCookie(HttpServletRequest request, String type){
        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if(cookie.getName().equals(type)){
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void authenticateUser(String jwt) throws IllegalStateException, SignatureException{
        if(jwtService.isTokenExpired(jwt)){
            throw new IllegalStateException("Token expired");
        }
        UserCredentials user = jwtService.getUserFromToken(jwt);
        if(user == null) throw new SignatureException("User not found");

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities());
        logger.info("User authenticated: { " + authentication + " }");
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
