package com.courier.resourceservice.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.courier.resourceservice.objects.dto.ContactBaseDto;
import com.courier.resourceservice.objects.dto.ContactDto;
import com.courier.resourceservice.objects.request.ContactSearchRequest;
import com.courier.resourceservice.objects.request.UsersContactSearchRequest;

public interface ContactService {

  Page<ContactBaseDto> getContacts(Pageable pageable);

  Page<ContactBaseDto> getContactsByOffice(Long officeId, Pageable pageable);

  List<ContactBaseDto> getContactsByOffice(Long officeId);

  List<ContactBaseDto> getContactsByBranch(Long branchId);

  ContactDto getContactByPhone(String phoneNumber);

  ContactDto getContactById(Long id);

  ContactDto createContact(ContactDto contactDto);

  ContactDto updateContact(Long id, ContactDto contactDto);

  void disabledContact(Long id);

  ContactDto enableContact(ContactDto contactDto);

  Page<ContactBaseDto> searchContacts(String searchQuery, Pageable pageable);

  Page<ContactBaseDto> searchUsersContacts(UsersContactSearchRequest request, Pageable pageable);

  Page<ContactBaseDto> searchAdvancedContacts(ContactSearchRequest request, Pageable pageable);
}
