package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.Status;

public interface StatusRepository extends JpaRepository<Status, Long>{
    Optional<Status> findById(Long id);

    List<Status> findAll();

    Optional<Status> findByName(String name);
}
