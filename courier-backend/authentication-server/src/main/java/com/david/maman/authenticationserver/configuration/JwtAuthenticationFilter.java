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
import com.david.maman.authenticationserver.helpers.TokenType;
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
        
        try {
            if(!jwtService.isPublicKeyAvailable()){
                throw new IllegalStateException("Public key not available for token validation");
            }

            String requestUri = request.getRequestURI();
            String token = null;
            TokenType tokenType = TokenType.ACCESS_TOKEN;                        
            if(requestUri.equals("/api/auth/refresh")){
                token = getTokenCookie(request, TokenType.REFRESH_TOKEN);
                tokenType = TokenType.REFRESH_TOKEN;
            } else{
                token = getTokenCookie(request, TokenType.ACCESS_TOKEN);
            }

            
            if(Strings.isNullOrEmpty(token)){
                chain.doFilter(request, response);
                return;
            }

            logger.info("Access Token: { " + token + " }");

            if(jwtService.isTokenExpired(token)){
                throw new IllegalStateException("Token expired");
            }
            CustomUserDetails userDetails = getUserDetails(token, tokenType);
            Authentication authentication = getAuthentication(userDetails);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (SignatureException | MalformedJwtException e) {
            throw new JwtException(e.getMessage());
        } catch(IllegalStateException e){
            throw new TokenValidationException(e.getMessage());
        }
        chain.doFilter(request, response);
    }

    private String getTokenCookie(HttpServletRequest request, TokenType tokenType){
        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if(cookie.getName().equals(tokenType.toString())){
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private CustomUserDetails getUserDetails(String token, TokenType tokenType) throws SignatureException{
        UserCredentials user = jwtService.getUserFromToken(token, tokenType);
        if(user == null) throw new SignatureException("User not found");

        return new CustomUserDetails(user);
    }

    private Authentication getAuthentication(CustomUserDetails userDetails){
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities());
        logger.info("User authenticated: { " + authentication + " }");
        return authentication;
    }
}
