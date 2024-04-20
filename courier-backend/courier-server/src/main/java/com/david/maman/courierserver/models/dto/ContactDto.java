package com.david.maman.courierserver.models.dto;

import java.util.ArrayList;
import java.util.List;

import com.david.maman.courierserver.models.entities.Contact;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactDto {

    private Long id;
    private String name;
    private String lastName;
    private String phone;

    private OfficeDto office;

    @Builder.Default
    private List<BranchDto> branches = new ArrayList<>();

    public static ContactDto toDto(Contact contact) {
        return ContactDto.builder()
            .id(contact.getId())
            .name(contact.getName())
            .lastName(contact.getLastName())
            .phone(contact.getPhone())
            .office(OfficeDto.toDto(contact.getOffice()))
            .branches(BranchDto.toDto(contact.getBranches()))
            .build();
    }

    public static List<ContactDto> toDto(List<Contact> contacts){
        List<ContactDto> contactDtos = new ArrayList<>();
        for (Contact contact : contacts) {
            contactDtos.add(ContactDto.toDto(contact));
        }
        return contactDtos;
    }

}
