package com.david.maman.courierserver.services;

import java.security.PublicKey;

import io.jsonwebtoken.Claims;


public interface JwtService {

    public void setPublicKey(PublicKey publicKey);

    public Boolean isPublicKeyAvailable();

    public Claims extractAllClaims(String token);

    public Boolean isTokenExpired(String token);
}
