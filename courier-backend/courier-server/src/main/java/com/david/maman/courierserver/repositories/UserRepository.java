package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByIdAndIsActive(Long id, Boolean isActive);

    Optional<User> findByEmailAndIsActive(String email, Boolean isActive);

    Optional<User> findByPhoneAndIsActive(String phone, Boolean isActive);

    Optional<User> findByNameAndLastNameAndIsActive(String firstName, String lastName, Boolean isActive);

    Optional<User> findByNameAndLastNameAndPhoneAndEmailAndIsActive(String firstName, String lastName, String phone, String email, Boolean isActive);

    List<User> findByNameContainingAndIsActive(String firstName, Boolean isActive);
    List<User> findByLastNameContainingAndIsActive(String lastName, Boolean isActive);
    List<User> findByPhoneContainingAndIsActive(String phone, Boolean isActive);
    List<User> findByEmailContainingAndIsActive(String email, Boolean isActive);


    List<User> findAll();

    List<User> findByIsActive(Boolean isActive);

    List<User> findAllByRolesAndIsActive(Role role, Boolean isActive);

}
