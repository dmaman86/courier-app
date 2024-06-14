package com.david.maman.authenticationserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.authenticationserver.models.entities.Role;
import com.david.maman.authenticationserver.models.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);

    List<User> findAllByRolesAndIsActive(Role role, boolean isActive);

    Optional<User> findByEmailAndPhoneAndIsActive(String email, String phone, boolean isActive);
}
