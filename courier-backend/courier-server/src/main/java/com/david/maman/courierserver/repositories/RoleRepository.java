package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

    List<Role> findAll();

    Page<Role> findAll(Pageable pageable);

    Role findByName(String name);

    Optional<Role> findById(Long id);

}
