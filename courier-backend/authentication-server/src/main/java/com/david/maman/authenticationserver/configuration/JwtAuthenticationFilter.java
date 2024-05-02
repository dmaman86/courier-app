package com.david.maman.authenticationserver.configuration;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.services.JwtService;

import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    protected static Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
 
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TokenRepository tokenRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException{
        
        String authHeader = request.getHeader("Authorization");
        logger.info("Authorization Header: { " + authHeader + " }");
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            String jwt = authHeader.substring(7);

            if(!jwt.isBlank()){
                try{
                    String userEmail = jwtService.extractUserName(jwt);
                    if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
                        authenticateUser(jwt, request);
                    }
                }catch(SignatureException | MalformedJwtException e){
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
                }
            }
        }
        chain.doFilter(request, response);
    }

    private void authenticateUser(String jwt, HttpServletRequest request) throws SignatureException {
        CustomUserDetails user = (CustomUserDetails) userDetailsServiceImpl.loadUserByUsername(jwtService.extractUserName(jwt));
        var isTokenValid = tokenRepository.findByToken(jwt)
                            .map(t -> !t.getIsExpired() && !t.getIsRevoked())
                            .orElse(false);
        if(jwtService.validateToken(jwt, user) && isTokenValid){
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,  user.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }else{
            throw new SignatureException("Invalid or expired JWT token");
        }
    }
}
