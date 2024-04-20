package com.david.maman.courierserver.models.entities;

import java.util.ArrayList;
import java.util.List;

import com.david.maman.courierserver.models.dto.OfficeDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "offices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Office {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @JsonManagedReference
    @OneToMany(mappedBy = "office", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Branch> branches = new ArrayList<>();

    public static Office toEntity(OfficeDto officeDto) {
        return Office.builder()
            .id(officeDto.getId())
            .name(officeDto.getName())
            .branches(Branch.toEntity(officeDto.getBranches()))
            .build();
    }

    public static List<Office> toEntity(List<OfficeDto> officeDtos){
        List<Office> offices = new ArrayList<>();
        for (OfficeDto officeDto : officeDtos) {
            offices.add(Office.toEntity(officeDto));
        }
        return offices;
    }
}
