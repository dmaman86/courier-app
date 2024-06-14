package com.david.maman.authenticationserver.services;

import java.security.KeyPair;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.models.entities.UserCredentials;

public interface JwtService {

    String generateToken(CustomUserDetails credentials);

    String generateRefreshToken(CustomUserDetails credentials);

    void setKeyPair(KeyPair keyPair);

    Boolean isPublicKeyAvailable();

    Boolean isTokenExpired(String token);

    UserCredentials getUserFromToken(String token);
}