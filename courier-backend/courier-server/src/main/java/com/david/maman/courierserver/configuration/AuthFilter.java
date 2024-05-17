package com.david.maman.courierserver.configuration;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.david.maman.courierserver.exceptions.PublicKeyNotAvailableException;
import com.david.maman.courierserver.helpers.CustomUserDetails;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.services.JwtService;
import com.google.common.base.Strings;

import io.jsonwebtoken.Claims;
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

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException{
        
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        logger.info("Authorization Header: { " + authHeader + " }");

        if(Strings.isNullOrEmpty(authHeader) || !authHeader.startsWith("Bearer ")){
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.replace("Bearer ", "");
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

            Claims claims = jwtService.extractAllClaims(token);
            Set<Role> roles = getRolesFromClaims(claims);

            User user = User.builder()
                .id(claims.get("id", Long.class))
                .name(claims.get("name", String.class))
                .lastName(claims.get("lastname", String.class))
                .email(claims.get("email", String.class))
                .phone(claims.get("phone", String.class))
                .roles(roles)
                .build();
                

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

    private Set<Role> getRolesFromClaims(Claims claims){
        List<Map<String, Object>> rolesMap = claims.get("roles", List.class);

        return rolesMap.stream()
            .map(role -> Role.builder()
                            .id(((Number) role.get("id")).longValue())
                            .name((String) role.get("name"))
                            .build())
            .collect(Collectors.toSet());
    }

}
