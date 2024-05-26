package com.david.maman.courierserver.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.ContactDto;
import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;

@Component
public class ContactMapper {

    public ContactDto toDto(Contact contact){

        OfficeInfoDto officeDto = OfficeInfoDto.builder()
                                                .id(contact.getOffice().getId())
                                                .name(contact.getOffice().getName())
                                                .build();

        return ContactDto.builder()
                .id(contact.getId())
                .name(contact.getName())
                .lastName(contact.getLastName())
                .phone(contact.getPhone())
                .office(officeDto)
                .branches(contact.getBranches().stream()
                            .map(branch -> {
                                return BranchInfoDto.builder()
                                            .id(branch.getId())
                                            .city(branch.getCity())
                                            .address(branch.getAddress())
                                            .build();
                            }).collect(Collectors.toList()))
                .build();
    }

    public Contact toEntity(ContactDto contactDto, Office office, List<Branch> branchs){

        return Contact.builder()
                .id(contactDto.getId())
                .name(contactDto.getName())
                .lastName(contactDto.getLastName())
                .phone(contactDto.getPhone())
                .office(office)
                .branches(branchs)
                .build();
    }

    public Contact toEntity(ClientDto clientDto, Office office, List<Branch> branchs){
        return Contact.builder()
                    .name(clientDto.getName())
                    .lastName(clientDto.getLastName())
                    .phone(clientDto.getPhone())
                    .office(office)
                    .branches(branchs)
                    .build();
    }


}
