package com.courier.resourceservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.courier.resourceservice.objects.entity.Office;

public interface OfficeRepository
    extends JpaRepository<Office, Long>, JpaSpecificationExecutor<Office> {

  Page<Office> findByEnabledTrue(Pageable pageable);

  Page<Office> findByEnabledTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

  List<Office> findByEnabledTrue();

  Optional<Office> findByIdAndEnabledTrue(Long id);
}
