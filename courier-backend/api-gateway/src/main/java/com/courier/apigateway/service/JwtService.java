package com.courier.apigateway.service;

import com.courier.apigateway.objects.dto.SecurityEventDto;

public interface JwtService {

  boolean isTokenValid(String token);

  SecurityEventDto getSecurityEvent(String token);
}
