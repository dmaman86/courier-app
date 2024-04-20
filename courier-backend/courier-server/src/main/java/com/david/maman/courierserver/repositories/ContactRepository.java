package com.david.maman.courierserver.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;

public interface ContactRepository extends JpaRepository<Contact, Long>{

    Optional<Contact> findById(Long id);

    Optional<Contact> findByPhone(String phone);

    Optional<Contact> findByNameAndLastName(String firstName, String lastName);

    Optional<Contact> findByNameAndLastNameAndPhone(String firstName, String lastName, String phone);

    List<Contact> findByNameContaining(String firstName);
    List<Contact> findByLastNameContaining(String lastName);
    List<Contact> findByPhoneContaining(String phone);

    List<Contact> findAll();

    List<Contact> findByOfficeAndBranches(Office office, List<Branch> branches);
    
    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.office")
    List<Contact> findAllWithOffice(); // get all contacts with office

    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.office WHERE c.id = :id")
    Contact findByIdWithOffice(@Param("id") Long id); // get contact by id with office

    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.branches")
    List<Contact> findAllWithBranches(); // get all contacts with branches

    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.branches WHERE c.id = :id")
    Contact findByIdWithBranches(@Param("id") Long id); // get contact by id with branches
}
