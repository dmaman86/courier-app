package com.token_server.services;

import java.security.KeyPair;
import java.security.PublicKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.token_server.models.entities.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    private KeyPair keyPair;
    private CompletableFuture<KeyPair> keyPairFuture = new CompletableFuture<>();

    public void setKeyPair(KeyPair keyPair) {
        this.keyPair = keyPair;
        keyPairFuture.complete(keyPair);
    }

    public Boolean isKeyPairSet(){
        return keyPair != null;
    }

    public Boolean isPublicKeyAvailable(){
        return keyPair.getPublic() != null;
    }

    public PublicKey getPublicKey(){
        if(this.keyPair == null){
            try{
                this.keyPair = keyPairFuture.get();
            }catch(Exception e){
                throw new RuntimeException("Error getting public key", e);
            }
        }
        return this.keyPair.getPublic();
    }

    public String buildToken(User user, long expiresIn){
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("lastName", user.getLastName());
        claims.put("email", user.getEmail());
        claims.put("phone", user.getPhone());
        claims.put("role", user.getRoles());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiresIn))
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }

}
