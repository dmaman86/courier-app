package com.david.maman.courierserver.configuration;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.david.maman.courierserver.helpers.CustomUserDetails;
import com.david.maman.courierserver.helpers.UserDetatailsServiceImpl;
import com.david.maman.courierserver.services.JwtService;

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
        
        String authHeader = request.getHeader("Authorization");
        logger.info("Authorization Header: { " + authHeader + " }");
        if(authHeader != null && !authHeader.isBlank() && authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);

            if(token == null || token.isBlank() || jwtService.isTokenExpired(token)){
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JWT token");
            }else{
                logger.info("Authorization Token: { " + token + " }");
                String email = jwtService.extractUserName(token);
                if(email != null && !email.isBlank()){
                    try{
                        CustomUserDetails userDetails = userDetailsService.loadUserByUsername(email);
                        if(jwtService.validateToken(token, userDetails)){
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                            
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        }
                    }catch(Exception e){
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
                    }
                }
            }
        }

        chain.doFilter(request, response);
    }

}
