package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

    List<Role> findAll();

    Role findByName(String name);

    Optional<Role> findById(Long id);

}
