package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.models.criteria.ContactSpecification;
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
    @Transactional(readOnly = true)
    public Page<Contact> findAllContacts(Pageable pageable){
        return contactRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> searchContacts(String toSearch, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        String[] searchTerms = toSearch.split("\\s+");
        Set<Contact> uniContacts = new HashSet<>();

        for(String term : searchTerms){
            Specification<Contact> spec = Specification.where(ContactSpecification.containsTextInAttributes(term));
            uniContacts.addAll(contactRepository.findAll(spec, pageable).getContent());
        }
        List<Contact> uniContactsList = new ArrayList<>(uniContacts);

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), uniContactsList.size());
        return new PageImpl<>(uniContactsList.subList(start, end), pageable, uniContactsList.size());
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
