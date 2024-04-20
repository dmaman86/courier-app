package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.dto.ContactDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.repositories.ContactRepository;
import com.david.maman.courierserver.services.ContactService;

@Service
public class ContactServiceImpl implements ContactService{

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public Optional<Contact> findContactById(Long id) {
        return contactRepository.findById(id);
    }

    @Override
    public void saveContact(Contact contact) {
        contactRepository.save(contact);
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    @Override
    public Optional<Contact> findContactByPhone(String phone) {
        return contactRepository.findByPhone(phone);
    }

    @Override
    public List<Contact> findAllContacts() {
        return contactRepository.findAll();
    }


    @Override
    public List<Contact> searchContacts(String toSearch) {
        List<Contact> contacts = new ArrayList<>();

        contacts.addAll(contactRepository.findByNameContaining(toSearch));
        contacts.addAll(contactRepository.findByLastNameContaining(toSearch));
        contacts.addAll(contactRepository.findByPhoneContaining(toSearch));

        Set<Contact> uniContacts = new HashSet<>(contacts);
        return new ArrayList<>(uniContacts);
    }

    @Override
    public Optional<Contact> findContactByNameAndLastNameAndPhone(ContactDto contactDto) {
        
        return contactRepository.findByNameAndLastNameAndPhone(
            contactDto.getName(),
            contactDto.getLastName(),
            contactDto.getPhone()
        );
    }

    @Override
    public List<Contact> findContactsByOfficeAndBranches(Office office, List<Branch> branches) {
        return contactRepository.findByOfficeAndBranches(office, branches);
    }
}
