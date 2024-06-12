package com.david.maman.courierserver.services;

import java.security.PublicKey;

import com.david.maman.courierserver.models.entities.User;

import io.jsonwebtoken.Claims;


public interface JwtService {

    public void setPublicKey(PublicKey publicKey);

    public Boolean isPublicKeyAvailable();

    public void setPublicKeyFlag(Boolean flag);

    public Claims extractAllClaims(String token);

    public Boolean isTokenExpired(String token);

    public User getUserFromToken(String token);
}
