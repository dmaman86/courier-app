package com.david.maman.authenticationserver.services.impl;

import java.security.KeyPair;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.services.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtServiceImpl implements JwtService{

    private KeyPair jwtKeyPair;

    private long jwtExpiration = 86400000; // 1 day

    private long jwtRefreshExpiration = 604800000; // 7 days

    @Autowired
    private TokenRepository tokenRepository;


    @Override
    public void setKeyPair(KeyPair keyPair) {
        this.jwtKeyPair = keyPair;
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
        var tokenDb = tokenRepository.findByUserIdAndTokenAndIsExpiredAndIsRevoked(credentials.getUser().getId(), token, false, false);

        if(tokenDb.isPresent()){
            Boolean isExpired = isTokenExpired(tokenDb.get().getToken());

            if(isExpired){
                tokenDb.get().setIsExpired(true);
                tokenRepository.save(tokenDb.get());
                return false;
            }
            return true;

        }
        return false;

    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private String generateToken(Map<String, Object> extraClaims, CustomUserDetails credentials){
        return buildToken(extraClaims, credentials, jwtExpiration);
    }

    public String buildToken(Map<String, Object> extraClaims, CustomUserDetails credentials, long expirationTime) {

        List<Map<String, Object>> roles = credentials.getUser().getRoles().stream()
                .map(role -> {
                    Map<String, Object> roleMap = new HashMap<>();
                    roleMap.put("id", role.getId());
                    roleMap.put("name", role.getName());
                    return roleMap;
                })
                .collect(Collectors.toList());

        return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(credentials.getUsername())
                    .claim("id", credentials.getUser().getId())
                    .claim("name", credentials.getUser().getName())
                    .claim("lastname", credentials.getUser().getLastName())
                    .claim("email", credentials.getUser().getEmail())
                    .claim("phone", credentials.getUser().getPhone())
                    .claim("roles", roles)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(jwtKeyPair.getPrivate(), SignatureAlgorithm.RS256)
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
                .setSigningKey(jwtKeyPair.getPublic())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
