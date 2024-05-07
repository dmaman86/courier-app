package com.david.maman.errorserver.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class EurekaValidationFilter implements Filter{

    private static final Logger logger = LoggerFactory.getLogger(EurekaValidationFilter.class);

    private final EurekaDiscoveryClient discoveryClient;

    public EurekaValidationFilter(EurekaDiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Override
    public void doFilter(ServletRequest request, 
                        ServletResponse response, 
                        FilterChain chain) throws ServletException, IOException{

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String serviceName = httpServletRequest.getHeader("Service-Name");

        if(serviceName != null && isServiceRegistered(serviceName)){
            chain.doFilter(request, response);
        }else{
            throw new ServletException("Unauthorized Service Request");
        }
    }

    private boolean isServiceRegistered(String serviceName){
        return discoveryClient.getInstances(serviceName).size() > 0;
    }

}
