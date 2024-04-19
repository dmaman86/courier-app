package com.david.maman.springcloudgateway.config;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;

@Service
public class RouterValidator {

    public static final List<String> openEndPoints = List.of("/api/auth/signin",
                                                             "/api/auth/refresh",
                                                            "/api/auth/logout");

    public Predicate<ServerHttpRequest> isSecured = request -> openEndPoints
                                        .stream().noneMatch(uri -> request.getURI().getPath().contains(uri));

}
