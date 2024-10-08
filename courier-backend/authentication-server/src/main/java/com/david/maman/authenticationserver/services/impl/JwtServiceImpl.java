package com.david.maman.authenticationserver.services.impl;

import java.security.KeyPair;
import java.security.PublicKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenResponse;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.entities.Token;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;
import com.david.maman.authenticationserver.services.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtServiceImpl implements JwtService{

    private static final Logger logger = LoggerFactory.getLogger(JwtServiceImpl.class);

    private PublicKey publicKey;

    private volatile boolean isPublicKeyAvailable = false;

    // private KeyPair jwtKeyPair;

    // private long jwtExpiration = 86400000; // 1 day
    private long jwtExpiration = 60000; // 1 minute
    // private long jwtExpiration = 600000; // 10 minutes
    private long jwtRefreshExpiration = 604800000; // 7 days
    // private long jwtRefreshExpiration = 300000; // 5 minutes
    // private long jwtRefreshExpiration = 1800000; // 30 minutes

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;


    @Override
    public void setPublicKey(PublicKey publicKey) {
        this.publicKey = publicKey;
        this.isPublicKeyAvailable = true;
    }

    @Override
    public Boolean isPublicKeyAvailable(){
        return this.isPublicKeyAvailable;
    }

    @Override
    public void setPublicKeyAvailable(Boolean available){
        this.isPublicKeyAvailable = available;
    }

    @Override
    public long getAccessTokenExpirationTime(){
        return jwtExpiration;
    }

    @Override
    public long getRefreshTokenExpirationTime(){
        return jwtRefreshExpiration;
    }

    /*@Override
    public TokenResponse generateToken(CustomUserDetails credentials) {
        Map<String, Object> claims = new HashMap<>();
        String token = buildToken(claims, credentials, jwtExpiration);
        return new TokenResponse(token, jwtExpiration);
    }*/

    /*@Override
    public TokenResponse generateRefreshToken(CustomUserDetails credentials){
        Map<String, Object> claims = new HashMap<>();
        String token = buildToken(claims, credentials, jwtRefreshExpiration);
        return new TokenResponse(token, jwtRefreshExpiration);
    }*/

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /*public String buildToken(Map<String, Object> extraClaims, CustomUserDetails credentials, long expirationTime) {
        var user = credentials.getCredentials().getUser();
        List<Map<String, Object>> roles = user.getRoles().stream()
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
                    .claim("email", user.getEmail())
                    .claim("phone", user.getPhone())
                    .claim("roles", roles)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(jwtKeyPair.getPrivate(), SignatureAlgorithm.RS256)
                    .compact();
    }*/

    @Override
    public long getExpirationTime(String token){
        Claims claims = extractAllClaims(token);
        return claims.getExpiration().getTime();
    }

    @Override
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    @Override
    public UserCredentials getUserFromToken(String token, TokenType tokenType){
        List<Token> tokenEntity = tokenRepository.findByTokenAndTokenTypeAndIsRevokedAndIsExpired(token, tokenType, false, false);
        if(!tokenEntity.isEmpty()){
            Token lasToken = tokenEntity.get(tokenEntity.size() - 1);
            return userCredentialsRepository.findByUserId(lasToken.getUser().getId()).orElse(null);
        }
        return null;
    }

    @Override
    public void revokeToken(CustomUserDetails credentials, String token, TokenType tokenType){
        Optional<Token> tokenEntity = tokenRepository.findByUserIdAndTokenAndTokenType(credentials.getCredentials().getUser().getId() ,token, tokenType);

        if(tokenEntity.isPresent()){
            Token foundToken = tokenEntity.get();
            foundToken.setIsExpired(true);
            foundToken.setIsRevoked(true);
            tokenRepository.save(foundToken);
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
