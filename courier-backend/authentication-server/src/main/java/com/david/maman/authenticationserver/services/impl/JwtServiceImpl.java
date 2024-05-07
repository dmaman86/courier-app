package com.david.maman.authenticationserver.services.impl;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.services.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtServiceImpl implements JwtService{

    private String jwtSigningKey;

    private long jwtExpiration;

    private long jwtRefreshExpiration;

    private final TokenRepository tokenRepository;


    public JwtServiceImpl(  @Value("${security.jwt.signin-key}") String jwtSigningKey,
                            @Value("${security.jwt.expiration}") long jwtExpiration,
                            @Value("${security.jwt.refresh-token.expiration}") long jwtRefreshExpiration,
                            TokenRepository tokenRepository) {
        this.jwtSigningKey = jwtSigningKey;
        this.jwtExpiration = jwtExpiration;
        this.jwtRefreshExpiration = jwtRefreshExpiration;
        this.tokenRepository = tokenRepository;
    }

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String generateToken(CustomUserDetails credentials) {
        Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, credentials);
    }

    @Override
    public String generateRefreshToken(CustomUserDetails credentials){
        Map<String, Object> claims = new HashMap<>();
        return buildToken(claims, credentials, jwtRefreshExpiration);
    }

    @Override
    public Boolean validateToken(String token, CustomUserDetails credentials) {
        return isSameUser(token, credentials) && !isTokenExpired(token) && isTokenValid(token, credentials);
    }

    private Boolean isTokenValid(String token, CustomUserDetails credentials){
        
        var isValidToken = tokenRepository.findByUserIdAndToken(credentials.getUser().getId(), token)
                .map(t -> !t.getIsRevoked() && !t.getIsExpired())
                .orElse(false);
        return isValidToken;
    }

    private Boolean isSameUser(String token, CustomUserDetails credentials){
        return extractUsername(token).equals(credentials.getUsername());
    }


    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private String generateToken(Map<String, Object> extraClaims, CustomUserDetails credentials){
        return buildToken(extraClaims, credentials, jwtExpiration);
    }

    public String buildToken(Map<String, Object> extraClaims, CustomUserDetails credentials, long expirationTime) {
        return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(credentials.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(getSigningKey())
                    .compact();
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
