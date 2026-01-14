package com.courier.userservice.objects.mappers;

import org.springframework.stereotype.Component;

import com.courier.userservice.objects.dto.ClientDto;
import com.courier.userservice.objects.dto.ContactDto;
import com.courier.userservice.objects.dto.UserDto;

@Component
public class ClientMapper {

  public ContactDto clientToContactDto(ClientDto clientDto) {
    if (clientDto == null) return null;

    return ContactDto.builder()
        .fullName(clientDto.getFullName())
        .phoneNumber(clientDto.getPhoneNumber())
        .office(clientDto.getOffice())
        .branches(clientDto.getBranches())
        .build();
  }

  public ClientDto fromUserAndContact(UserDto userDto, ContactDto contactDto) {
    if (userDto == null || contactDto == null) return null;

    return ClientDto.builder()
        .id(userDto.getId())
        .fullName(userDto.getFullName())
        .phoneNumber(userDto.getPhoneNumber())
        .email(userDto.getEmail())
        .roles(userDto.getRoles())
        .office(contactDto.getOffice())
        .branches(contactDto.getBranches())
        .build();
  }
}

// @Mapper(
//     componentModel = MappingConstants.ComponentModel.SPRING,
//     uses = {RoleMapper.class})
// public interface ClientMapper {
//
//   @Mapping(source = "office", target = "office")
//   @Mapping(source = "branches", target = "branches")
//   ContactDto clientToContactDto(ClientDto clientDto);
//
//   @Mapping(source = "roles", target = "roles")
//   UserDto clientToUserDto(ClientDto clientDto);
//
//   @Mapping(target = "createdAt", ignore = true)
//   @Mapping(target = "updatedAt", ignore = true)
//   @Mapping(target = "disabledAt", ignore = true)
//   @Mapping(target = "enabled", ignore = true)
//   @Mapping(source = "roles", target = "roles")
//   User clientToUser(ClientDto clientDto);
//
//   @Mapping(source = "contactDto.office", target = "office")
//   @Mapping(source = "contactDto.branches", target = "branches")
//   @Mapping(source = "userDto.phoneNumber", target = "phoneNumber")
//   @Mapping(source = "userDto.id", target = "id")
//   @Mapping(source = "userDto.fullName", target = "fullName")
//   ClientDto fromUserAndContact(UserDto userDto, ContactDto contactDto);
// }
