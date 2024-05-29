package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.courierserver.models.entities.Status;

public interface StatusRepository extends JpaRepository<Status, Long>{
    Optional<Status> findById(Long id);

    List<Status> findAll();

    Page<Status> findAll(Pageable pageable);

    Optional<Status> findByName(String name);
}
