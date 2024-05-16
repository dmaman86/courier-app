package com.david.maman.courierserver.services;

import java.security.Key;
import java.security.PublicKey;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.helpers.CustomUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    
    private PublicKey jwtPublicKey;

    private volatile boolean isPublicKeyAvailable = false;

    public void setPublicKey(PublicKey publicKey){
        this.jwtPublicKey = publicKey;
        this.isPublicKeyAvailable = true;
    }

    public Boolean isPublicKeyAvailable(){
        return this.isPublicKeyAvailable;
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Boolean validateToken(String token, CustomUserDetails user){
        if(!isPublicKeyAvailable){
            throw new IllegalStateException("Public key not available for token validation.");
        }
        final String username = extractUserName(token);
        return (username.equals(user.getUsername()) && !isTokenExpired(token));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(this.jwtPublicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

}
