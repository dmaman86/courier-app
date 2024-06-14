package com.david.maman.authenticationserver.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.authenticationserver.models.entities.UserCredentials;

public interface UserCredentialsRepository extends JpaRepository<UserCredentials, Long>{

    Optional<UserCredentials> findByUserEmail(String email);

    Optional<UserCredentials> findByUserPhone(String phone);

    Optional<UserCredentials> findByUserEmailOrUserPhone(String email, String phone);

    Optional<UserCredentials> findByUserId(Long userId);
}
