package com.courier.apigateway.service.impl;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.courier.apigateway.exceptions.PublicKeyException;
import com.courier.apigateway.exceptions.TokenValidationException;
import com.courier.apigateway.objects.dto.SecurityEventDto;
import com.courier.apigateway.service.JwtService;
import com.courier.apigateway.service.RedisKeysService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtServiceImpl implements JwtService {

  private static final Logger logger = LoggerFactory.getLogger(JwtServiceImpl.class);

  @Autowired private RedisKeysService redisKeysService;

  @Override
  public boolean isTokenValid(String token) {
    return extractExpiration(token).after(new Date());
  }

  @Override
  public SecurityEventDto getSecurityEvent(String token) {
    Claims claims = parseTokenClaims(token);
    return SecurityEventDto.builder()
        .userId(claims.get("id", Long.class))
        // .ip(claims.get("ip", String.class))
        .userAgent(claims.get("userAgent", String.class))
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
    List<String> publicKeys = redisKeysService.getPublicKeys();

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
