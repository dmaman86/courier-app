package com.courier.resourceservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.courier.resourceservice.manager.ContactManager;
import com.courier.resourceservice.objects.criteria.ContactCriteria;
import com.courier.resourceservice.objects.dto.ContactBaseDto;
import com.courier.resourceservice.objects.dto.ContactDto;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.mapper.ContactMapper;
import com.courier.resourceservice.objects.request.ContactSearchRequest;
import com.courier.resourceservice.objects.request.UsersContactSearchRequest;
import com.courier.resourceservice.repository.ContactRepository;
import com.courier.resourceservice.service.ContactService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ContactServiceImpl implements ContactService {

  @Autowired private ContactRepository contactRepository;

  @Autowired private ContactMapper contactMapper;

  @Autowired private ContactManager contactManager;

  @Override
  public Page<ContactBaseDto> getContacts(Pageable pageable) {
    return contactRepository.findByEnabledTrue(pageable).map(contactMapper::toBaseDto);
  }

  @Override
  public Page<ContactBaseDto> getContactsByOffice(Long officeId, Pageable pageable) {
    return contactRepository
        .findByEnabledTrueAndOfficeId(officeId, pageable)
        .map(contactMapper::toBaseDto);
  }

  @Override
  public List<ContactBaseDto> getContactsByOffice(Long officeId) {
    return contactRepository.findByEnabledTrueAndOfficeId(officeId).stream()
        .map(contactMapper::toBaseDto)
        .collect(Collectors.toList());
  }

  @Override
  public List<ContactBaseDto> getContactsByBranch(Long branchId) {
    var contacts = contactRepository.findByEnabledTrueAndBranchesId(branchId);
    return contactMapper.toBaseDtoList(contacts);
  }

  @Override
  public ContactDto getContactByPhone(String phoneNumber) {
    return contactRepository
        .findByPhoneNumberAndEnabledTrue(phoneNumber)
        .map(contactMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
  }

  @Override
  public ContactDto getContactById(Long id) {
    return contactRepository
        .findById(id)
        .filter(Contact::isEnabled)
        .map(contactMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
  }

  @Override
  public ContactDto createContact(ContactDto contactDto) {
    return contactMapper.toDto(contactManager.createContact(contactDto));
  }

  @Override
  public ContactDto updateContact(Long id, ContactDto contactDto) {
    return contactMapper.toDto(contactManager.updateContact(id, contactDto));
  }

  @Override
  public void disabledContact(Long id) {
    contactManager.disableContact(id);
  }

  @Override
  public ContactDto enableContact(ContactDto contactDto) {
    return contactMapper.toDto(contactManager.enableContact(contactDto));
  }

  @Override
  public Page<ContactBaseDto> searchContacts(String searchQuery, Pageable pageable) {
    if (searchQuery == null || searchQuery.trim().isEmpty()) {
      return Page.empty();
    }

    Specification<Contact> spec = ContactCriteria.containsText(searchQuery);
    Page<Contact> contacts = contactRepository.findAll(spec, pageable);
    return contacts.map(contactMapper::toBaseDto);
  }

  @Override
  public Page<ContactBaseDto> searchUsersContacts(
      UsersContactSearchRequest request, Pageable pageable) {
    Specification<Contact> spec = ContactCriteria.containsSpec(request);
    Page<Contact> contacts = contactRepository.findAll(spec, pageable);
    return contacts.map(contactMapper::toBaseDto);
  }

  @Override
  public Page<ContactBaseDto> searchAdvancedContacts(
      ContactSearchRequest request, Pageable pageable) {
    Specification<Contact> spec = ContactCriteria.extendedSpec(request);
    Page<Contact> contacts = contactRepository.findAll(spec, pageable);
    return contacts.map(contactMapper::toBaseDto);
  }
}
