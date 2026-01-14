package com.courier.resourceservice.service;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.courier.resourceservice.exception.PublicKeyException;
import com.courier.resourceservice.exception.TokenValidationException;
import com.courier.resourceservice.objects.dto.UserContext;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtService {

  private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

  @Autowired private RedisService redisService;

  public boolean isTokenValid(String token) {
    return extractExpiration(token).after(new Date());
  }

  public UserContext getUserContext(String token) {
    Claims claims = parseTokenClaims(token);

    Collection<? extends GrantedAuthority> authorities =
        ((List<?>) claims.get("roles"))
            .stream()
                .map(Object::toString)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

    return UserContext.builder()
        .id(Long.parseLong(claims.get("id").toString()))
        .fullName(claims.get("fullName", String.class))
        .phoneNumber(claims.get("phoneNumber", String.class))
        .email(claims.get("email", String.class))
        .roles(authorities)
        .build();
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = parseTokenClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims parseTokenClaims(String token) {
    List<String> publicKeys = redisService.getPublicKeys();

    for (String publicKeyStr : publicKeys) {
      try {
        PublicKey publicKey = getPublicKey(publicKeyStr);

        return Jwts.parserBuilder()
            .setSigningKey(publicKey)
            .build()
            .parseClaimsJws(token)
            .getBody();

      } catch (Exception e) {
        logger.warn("Signature failed with public key, trying next key...");
      }
    }
    logger.error("No valid public key found to verify signature");
    throw new TokenValidationException("Token could not be validated against active public keys");
  }

  private PublicKey getPublicKey(String publicKeyStr) {
    if (publicKeyStr == null) {
      throw new PublicKeyException("Public key has not been set yet.");
    }

    try {
      byte[] keyBytes = Base64.getDecoder().decode(publicKeyStr);
      X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      return keyFactory.generatePublic(keySpec);

    } catch (Exception e) {
      throw new RuntimeException("Error loading public key from Redis", e);
    }
  }
}
