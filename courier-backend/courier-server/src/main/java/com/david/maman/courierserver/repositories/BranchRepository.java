package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.david.maman.courierserver.models.entities.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long>{

    Optional<Branch> findById(Long id);

    @Query("SELECT b FROM Branch b JOIN FETCH b.office WHERE b.id = :id")
    Branch findByIdWithOffice(@Param("id") Long id);

    Optional<Branch> findByCity(String city);

    Optional<Branch> findByAddress(String address);

    Optional<Branch> findByCityAndAddress(String city, String address);

    List<Branch> findByCityContaining(String city);
    List<Branch> findByAddressContaining(String address);

    List<Branch> findAll();
}
