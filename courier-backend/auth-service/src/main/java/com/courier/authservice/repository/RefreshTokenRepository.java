package com.courier.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courier.authservice.objects.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

  Optional<RefreshToken> findByToken(String token);

  void deleteByUserId(Long userId);

  boolean existsByUserId(Long userId);
}
