package com.courier.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.courier.userservice.objects.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {

  Optional<Role> findByNameAndEnabledTrue(String name);

  boolean existsByNameAndEnabledTrue(String name);

  Page<Role> findByEnabledTrue(Pageable pageable);

  List<Role> findByEnabledTrue();

  Optional<Role> findByIdAndEnabledTrue(Long id);
}
