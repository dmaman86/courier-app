package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;

public interface BranchRepository extends JpaRepository<Branch, Long>, JpaSpecificationExecutor<Branch>{

    Optional<Branch> findById(Long id);

    @Query("SELECT b FROM Branch b JOIN FETCH b.office WHERE b.id = :id")
    Branch findByIdWithOffice(@Param("id") Long id);

    Optional<Branch> findByCity(String city);

    Optional<Branch> findByAddress(String address);

    Optional<Branch> findByCityAndAddress(String city, String address);

    List<Branch> findByCityContainingIgnoreCase(String city);
    List<Branch> findByAddressContainingIgnoreCase(String address);

    Page<Branch> findByCityContainingIgnoreCase(String city, Pageable pageable);
    Page<Branch> findByAddressContainingIgnoreCase(String address, Pageable pageable);

    List<Branch> findAll();

    Page<Branch> findAll(Pageable pageable);

    long countByOffice(Office office);

}
