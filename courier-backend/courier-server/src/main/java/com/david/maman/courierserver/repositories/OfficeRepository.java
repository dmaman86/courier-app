package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.david.maman.courierserver.models.entities.Office;

public interface OfficeRepository extends JpaRepository<Office, Long>{

    Optional<Office> findById(Long id);

    Optional<Office> findByName(String name);

    List<Office> findAll();

    @Query("SELECT o FROM Office o LEFT JOIN FETCH o.branches")
    List<Office> findAllWithBranches();

    @Query("SELECT o FROM Office o LEFT JOIN FETCH o.branches WHERE o.id = :id")
    Office findByIdWithBranches(@Param("id") Long id);

    List<Office> findByNameContainingIgnoreCase(String name);
    
}
