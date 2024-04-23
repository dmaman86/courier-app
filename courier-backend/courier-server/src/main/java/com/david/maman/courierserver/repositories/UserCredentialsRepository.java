package com.david.maman.courierserver.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.UserCredentials;

public interface UserCredentialsRepository extends JpaRepository<UserCredentials, Long>{

    Optional<UserCredentials> findByUserEmail(String email);
    Optional<UserCredentials> findByUserId(Long id);
}
