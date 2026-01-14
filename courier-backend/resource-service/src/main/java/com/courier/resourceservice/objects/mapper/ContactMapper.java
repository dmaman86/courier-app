package com.courier.resourceservice.objects.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.courier.resourceservice.objects.dto.ContactBaseDto;
import com.courier.resourceservice.objects.dto.ContactDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;

@Component
public class ContactMapper {

  @Autowired private OfficeMapper officeMapper;

  @Autowired private BranchMapper branchMapper;

  public ContactDto toDto(Contact contact) {
    if (contact == null) return null;

    return ContactDto.builder()
        .id(contact.getId())
        .fullName(contact.getFullName())
        .phoneNumber(contact.getPhoneNumber())
        .office(officeMapper.toBaseDto(contact.getOffice()))
        .branches(branchMapper.toBaseDtoList(contact.getBranches()))
        .build();
  }

  public ContactBaseDto toBaseDto(Contact contact) {
    if (contact == null) return null;

    return ContactBaseDto.builder()
        .id(contact.getId())
        .fullName(contact.getFullName())
        .phoneNumber(contact.getPhoneNumber())
        .office(officeMapper.toBaseDto(contact.getOffice()))
        .build();
  }

  public List<ContactDto> toDtoList(List<Contact> contacts) {
    if (contacts == null) return null;

    return contacts.stream().map(this::toDto).collect(Collectors.toList());
  }

  public List<ContactBaseDto> toBaseDtoList(List<Contact> contacts) {
    if (contacts == null) return null;

    return contacts.stream().map(this::toBaseDto).collect(Collectors.toList());
  }

  public Contact toEntity(ContactBaseDto contactBaseDto) {
    if (contactBaseDto == null) return null;

    return Contact.builder()
        .id(contactBaseDto.getId())
        .fullName(contactBaseDto.getFullName())
        .phoneNumber(contactBaseDto.getPhoneNumber())
        .office(officeMapper.toEntity(contactBaseDto.getOffice()))
        .build();
  }

  public Contact toEntity(ContactBaseDto contactBaseDto, List<Branch> branches) {
    if (contactBaseDto == null) return null;

    Contact contact = toEntity(contactBaseDto);
    contact.setBranches(branches);
    return contact;
  }
}

// @Mapper(
//     componentModel = MappingConstants.ComponentModel.SPRING,
//     uses = {OfficeMapper.class, BranchMapper.class})
// public interface ContactMapper {
//
//   @Mapping(target = "office", qualifiedByName = "toBaseDto")
//   @Mapping(target = "branches", qualifiedByName = "toBaseDtoList")
//   ContactDto toDto(Contact contact);
//
//   @Named("toBaseDto")
//   ContactBaseDto toBaseDto(Contact contact);
//
//   List<ContactDto> toDtoList(List<Contact> contacts);
//
//   @Mapping(target = "office", ignore = true)
//   @Mapping(target = "branches", ignore = true)
//   @Mapping(target = "createdAt", ignore = true)
//   @Mapping(target = "updatedAt", ignore = true)
//   @Mapping(target = "enabled", ignore = true)
//   @Mapping(target = "disabledAt", ignore = true)
//   Contact toEntity(ContactDto contactDto);
// }
