package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.david.maman.courierserver.models.entities.Office;

public interface OfficeRepository extends JpaRepository<Office, Long>, JpaSpecificationExecutor<Office>{

    Optional<Office> findById(Long id);

    Optional<Office> findByName(String name);

    @Query("SELECT o FROM Office o LEFT JOIN FETCH o.branches")
    List<Office> findAllWithBranches();

    @Query("SELECT o FROM Office o LEFT JOIN FETCH o.branches WHERE o.id = :id")
    Office findByIdWithBranches(@Param("id") Long id);

    List<Office> findByNameContainingIgnoreCase(String name);

    Page<Office> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Office> findAll();

    Page<Office> findAll(Pageable pageable);
    
}
