package com.david.maman.authenticationserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.entities.Token;

public interface TokenRepository extends JpaRepository<Token, Long>{

    Optional<Token> findByTokenAndIsRevokedAndIsExpired(String token, Boolean isRevoked, Boolean isExpired);

    // List<Token> findByUserIdAndIsExpiredFalseOrIsRevokedFalse(Long userId);

    List<Token> findByUserId(Long userId);

    Optional<Token> findByUserIdAndToken(Long userId, String token);

    Optional<Token> findByUserIdAndTokenType(Long userId, TokenType tokenType);

    Optional<Token> findByUserIdAndTokenTypeAndIsRevokedAndIsExpired(Long userId, TokenType tokenType, Boolean isRevoked, Boolean isExpired);
}
