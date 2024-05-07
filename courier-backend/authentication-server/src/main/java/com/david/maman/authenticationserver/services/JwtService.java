package com.david.maman.authenticationserver.services;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;

public interface JwtService {

    String generateToken(CustomUserDetails credentials);

    String generateRefreshToken(CustomUserDetails credentials);

    String extractUsername(String token);

    Boolean validateToken(String token, CustomUserDetails credentials);
    
}