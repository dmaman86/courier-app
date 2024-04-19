package com.david.maman.authenticationserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.authenticationserver.models.entities.Token;

public interface TokenRepository extends JpaRepository<Token, Long>{

    Optional<Token> findByToken(String token);

    List<Token> findByUserIdAndIsExpiredFalseOrIsRevokedFalse(Long userId);
}
