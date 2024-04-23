package com.david.maman.authenticationserver.services;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${security.jwt.signin-key}")
    private String jwtSigningKey;

    @Value("${security.jwt.expiration}")
    private long jwtExpiration;

    @Value("${security.jwt.refresh-token.expiration}")
    private long jwtRefreshExpiration;

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(CustomUserDetails credentials){
        Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, credentials);
    }

    public String generateToken(Map<String, Object> extraClaims, CustomUserDetails credentials){
        return buildToken(extraClaims, credentials, jwtExpiration);
    }

    public String generateRefreshToken(CustomUserDetails credentials){
        Map<String, Object> claims = new HashMap<>();
        return buildToken(claims, credentials, jwtRefreshExpiration);
    }

    public long getExpirationTime(){
        return jwtExpiration;
    }

    public String buildToken(Map<String, Object> extraClaims, CustomUserDetails credentials, long expirationTime) {
        return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(credentials.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
    }

    public Boolean validateToken(String token, CustomUserDetails credentials) {
        final String email = extractUserName(token);
        return (email.equals(credentials.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }   
}