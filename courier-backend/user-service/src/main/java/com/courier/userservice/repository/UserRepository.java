package com.courier.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.courier.userservice.objects.entity.User;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

  Page<User> findByEnabledTrue(Pageable pageable);

  List<User> findByEnabledTrue();

  Optional<User> findByIdAndEnabledTrue(Long id);

  Optional<User> findByFullNameOrPhoneNumberAndEnabledTrue(String fullName, String phoneNumber);

  Optional<User> findByEmailOrPhoneNumberAndEnabledTrue(String email, String phoneNumber);

  Optional<User> findByEmailOrPhoneNumber(String email, String phoneNumber);

  Optional<User> findByPhoneNumberAndEnabledTrue(String phoneNumber);

  boolean existsByPhoneNumberAndEnabledTrue(String phoneNumber);

  long countByRolesIdAndEnabledTrue(Long roleId);

  List<User> findByRolesIdAndEnabledTrue(Long roleId);

  List<User> findByRolesNameAndEnabledTrue(String roleName);
}
