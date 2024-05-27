package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.dto.ContactDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;

public interface ContactService {

    Optional<Contact> findContactById(Long id);

    void saveContact(Contact contact);

    void deleteContact(Long id);

    Optional<Contact> findContactByPhone(String phone);

    Optional<Contact> findContactByNameAndLastNameAndPhone(ContactDto contactDto);

    List<Contact> findAllContacts();

    List<ContactDto> searchContacts(String toSearch);

    List<Contact> findContactsByOfficeAndBranches(Office office, List<Branch> branches);
}
