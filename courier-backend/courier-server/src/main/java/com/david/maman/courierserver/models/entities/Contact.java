package com.david.maman.courierserver.models.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.david.maman.courierserver.models.dto.ContactDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String lastName;

    private String phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "office_id")
    private Office office;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "contacts_branches",
        joinColumns = @JoinColumn(name = "contact_id"),
        inverseJoinColumns = @JoinColumn(name = "branches_id")
    )
    @Builder.Default
    private Set<Branch> branches = new HashSet<>();

    public static Contact toEntity(ContactDto contactDto){
        return Contact.builder()
            .id(contactDto.getId())
            .name(contactDto.getName())
            .lastName(contactDto.getLastName())
            .phone(contactDto.getPhone())
            .office(Office.toEntity(contactDto.getOffice()))
            .branches(new HashSet<>(Branch.toEntity(contactDto.getBranches())))
            .build();
    }

    public static List<Contact> toEntity(List<ContactDto> contactDtos){
        List<Contact> contacts = new ArrayList<>();
        for (ContactDto contactDto : contactDtos) {
            contacts.add(Contact.toEntity(contactDto));
        }
        return contacts;
    }
}
