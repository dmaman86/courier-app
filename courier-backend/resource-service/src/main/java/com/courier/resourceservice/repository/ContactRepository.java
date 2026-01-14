package com.courier.resourceservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.entity.Office;

public interface ContactRepository
    extends JpaRepository<Contact, Long>, JpaSpecificationExecutor<Contact> {

  Page<Contact> findByEnabledTrue(Pageable pageable);

  Page<Contact> findByEnabledTrueAndOfficeId(Long officeId, Pageable pageable);

  List<Contact> findByEnabledTrue();

  List<Contact> findByEnabledTrueAndOfficeId(Long officeId);

  List<Contact> findByEnabledTrueAndBranchesId(Long branchId);

  Optional<Contact> findByPhoneNumberAndEnabledTrue(String phoneNumber);

  long countByEnabledTrueAndOfficeId(Long officeId);

  boolean existsByPhoneNumberAndEnabledTrue(String phoneNumber);

  List<Contact> findAllByBranchesContainingAndEnabledTrue(Branch branch);

  List<Contact> findAllByOfficeAndEnabledTrue(Office office);
}
