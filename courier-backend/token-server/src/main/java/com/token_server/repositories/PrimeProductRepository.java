package com.token_server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.token_server.models.entities.PrimeProduct;

public interface PrimeProductRepository extends JpaRepository<PrimeProduct, Long>{

}
