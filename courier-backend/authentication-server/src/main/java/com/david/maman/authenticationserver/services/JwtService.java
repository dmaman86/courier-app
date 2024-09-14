package com.david.maman.authenticationserver.services;

import java.security.KeyPair;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenResponse;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.entities.UserCredentials;

public interface JwtService {

    TokenResponse generateToken(CustomUserDetails credentials);

    TokenResponse generateRefreshToken(CustomUserDetails credentials);

    void setKeyPair(KeyPair keyPair);

    Boolean isPublicKeyAvailable();

    Boolean isTokenExpired(String token);

    UserCredentials getUserFromToken(String token, TokenType tokenType);

    void revokeToken(CustomUserDetails credentials, String token, TokenType tokenType);
}