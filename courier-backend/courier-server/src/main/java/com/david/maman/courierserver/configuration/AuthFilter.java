package com.david.maman.courierserver.configuration;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.david.maman.courierserver.exceptions.PublicKeyNotAvailableException;
import com.david.maman.courierserver.helpers.CustomUserDetails;
import com.david.maman.courierserver.helpers.TokenType;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.services.JwtService;
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
public class AuthFilter extends OncePerRequestFilter{

    private static Logger logger = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private JwtService jwtService;

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException{
        
        String token = null;

        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if(cookie.getName().equals(TokenType.ACCESS_TOKEN.toString())){
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if(Strings.isNullOrEmpty(token)){
            chain.doFilter(request, response);
            return;
        }
        logger.info("Access Token: { " + token + " }");

        try{
            if(!jwtService.isPublicKeyAvailable()){
                throw new IllegalStateException("Public key not available for token validation.");
            }
            authenticateUser(token);
        }catch (SignatureException | MalformedJwtException e) {
            throw new JwtException(e.getMessage());
        } catch(IllegalStateException e){
            throw new PublicKeyNotAvailableException(e.getMessage());
        }
        chain.doFilter(request, response);
    }


    private void authenticateUser(String token){
        try{
            if(jwtService.isTokenExpired(token))
                throw new SignatureException("Invalid or expired JWT token");


            User user = jwtService.getUserFromToken(token);
            if(user == null){
                throw new IllegalStateException("User not found");
            }                

            CustomUserDetails userDetails = new CustomUserDetails(user, "");

            Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            logger.info("User authenticated: { " + auth + " }");
            SecurityContextHolder.getContext().setAuthentication(auth);
        }catch(IllegalStateException e){
            throw new IllegalStateException(e.getMessage());
        } catch(SignatureException e){
            throw new SignatureException("Invalid or expired JWT token");
        }
    }

}
