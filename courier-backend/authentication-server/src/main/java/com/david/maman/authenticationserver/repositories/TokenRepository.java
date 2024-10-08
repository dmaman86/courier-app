package com.david.maman.authenticationserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.entities.Token;

public interface TokenRepository extends JpaRepository<Token, Long>{

    Optional<Token> findByTokenAndIsRevokedAndIsExpired(String token, Boolean isRevoked, Boolean isExpired);

    List<Token> findByUserId(Long userId);

    List<Token> findByUserIdAndTokenTypeAndIsRevokedFalseAndIsExpiredFalse(Long userId, TokenType tokenType);

    Optional<Token> findByTokenAndTokenType(String token, TokenType tokenType);

    Optional<Token> findByUserIdAndTokenAndTokenType(Long userId, String token, TokenType tokenType);

    Optional<Token> findByUserIdAndToken(Long userId, String token);

    Optional<Token> findByUserIdAndTokenType(Long userId, TokenType tokenType);

    Optional<Token> findByUserIdAndTokenAndIsExpired(Long userId, String token, Boolean isExpired);

    Optional<Token> findByUserIdAndTokenAndIsExpiredAndIsRevoked(Long userId, String token, Boolean isExpired, Boolean isRevoked);

    Optional<Token> findByUserIdAndTokenTypeAndIsRevoked(Long userId, TokenType tokenType, Boolean isRevoked);

    Optional<Token> findByUserIdAndTokenTypeAndIsRevokedAndIsExpired(Long userId, TokenType tokenType, Boolean isRevoked, Boolean isExpired);

    List<Token> findByTokenAndTokenTypeAndIsRevokedAndIsExpired(String token, TokenType tokenType, Boolean isRevoked, Boolean isExpired);
}
