package com.david.maman.primesserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.david.maman.primesserver.models.entities.PrimeProduct;

public interface PrimeProductRepository extends JpaRepository<PrimeProduct, Long>{

}
