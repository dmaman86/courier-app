package com.david.maman.springcloudgateway.config;

import java.util.List;
import java.util.function.Predicate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;

@Service
public class RouterValidator {

    private static final Logger logger = LoggerFactory.getLogger(RouterValidator.class);
    
    public static final List<String> openEndPoints = List.of("/api/auth/signin");

    public Predicate<ServerHttpRequest> isSecured = request -> {
        boolean isSecure = openEndPoints.stream()
                .noneMatch(uri -> request.getURI().getPath().contains(uri));
        logger.info("Evaluating security for request path: {}, is secure: {}", request.getURI().getPath(), isSecure);
        return isSecure;
    };

}
