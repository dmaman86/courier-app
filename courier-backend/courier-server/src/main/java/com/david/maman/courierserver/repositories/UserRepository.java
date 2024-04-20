package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByNameAndLastName(String firstName, String lastName);

    Optional<User> findByNameAndLastNameAndPhoneAndEmail(String firstName, String lastName, String phone, String email);

    List<User> findByNameContaining(String firstName);
    List<User> findByLastNameContaining(String lastName);
    List<User> findByPhoneContaining(String phone);
    List<User> findByEmailContaining(String email);


    List<User> findAll();

}
