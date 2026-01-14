package com.courier.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courier.authservice.objects.entity.UserCredential;

public interface UserCredentialRepository extends JpaRepository<UserCredential, Long> {

  Optional<UserCredential> findByUserId(Long userId);

  Optional<UserCredential> findByUserIdAndEnabledTrue(Long userId);

  boolean existsByUserId(Long userId);
}
