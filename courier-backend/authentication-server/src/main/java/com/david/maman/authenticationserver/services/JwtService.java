package com.david.maman.authenticationserver.services;

import java.security.KeyPair;
import java.security.PublicKey;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenResponse;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.entities.UserCredentials;

public interface JwtService {

    // TokenResponse generateToken(CustomUserDetails credentials);

    // TokenResponse generateRefreshToken(CustomUserDetails credentials);

    // void setKeyPair(KeyPair keyPair);
    void setPublicKey(PublicKey publicKey);

    Boolean isPublicKeyAvailable();

    void setPublicKeyAvailable(Boolean available);

    long getAccessTokenExpirationTime();

    long getRefreshTokenExpirationTime();

    long getExpirationTime(String token);

    Boolean isTokenExpired(String token);

    UserCredentials getUserFromToken(String token, TokenType tokenType);

    void revokeToken(CustomUserDetails credentials, String token, TokenType tokenType);
}