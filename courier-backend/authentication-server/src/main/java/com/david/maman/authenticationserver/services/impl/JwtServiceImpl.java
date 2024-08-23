package com.david.maman.authenticationserver.services.impl;

import java.security.KeyPair;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenResponse;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;
import com.david.maman.authenticationserver.services.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtServiceImpl implements JwtService{

    private static final Logger logger = LoggerFactory.getLogger(JwtServiceImpl.class);

    private KeyPair jwtKeyPair;

    // private long jwtExpiration = 86400000; // 1 day
    private long jwtExpiration = 60000; // 1 minute
    // private long jwtRefreshExpiration = 604800000; // 7 days
    private long jwtRefreshExpiration = 300000; // 5 minutes

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public void setKeyPair(KeyPair keyPair) {
        this.jwtKeyPair = keyPair;
    }

    @Override
    public Boolean isPublicKeyAvailable(){
        return jwtKeyPair.getPublic() != null;
    }

    @Override
    public TokenResponse generateToken(CustomUserDetails credentials) {
        Map<String, Object> claims = new HashMap<>();
        String token = buildToken(claims, credentials, jwtExpiration);
        return new TokenResponse(token, jwtExpiration);
    }

    @Override
    public TokenResponse generateRefreshToken(CustomUserDetails credentials){
        Map<String, Object> claims = new HashMap<>();
        String token = buildToken(claims, credentials, jwtRefreshExpiration);
        return new TokenResponse(token, jwtRefreshExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String buildToken(Map<String, Object> extraClaims, CustomUserDetails credentials, long expirationTime) {
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
    }

    @Override
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    @Override
    public UserCredentials getUserFromToken(String token){
        try{
            Claims claims = extractAllClaims(token);
            String phone = claims.get("phone", String.class);
            String email = claims.get("email", String.class);

            User user = userRepository.findByEmailAndPhoneAndIsActive(email, phone, true).orElse(null);
            if(user == null) return null;
            return userCredentialsRepository.findByUserId(user.getId()).orElse(null);
        }catch (JwtException | IllegalArgumentException e) {
            logger.error("Error parsing token claims: " + e.getMessage());
            return null;
        }
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
