package com.david.maman.courierserver.models.entities;

import java.util.ArrayList;
import java.util.List;

import com.david.maman.courierserver.models.dto.BranchDto;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "branches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;

    private String address;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "office_id")
    private Office office;

    public static Branch toEntity(BranchDto branchDto) {
        return Branch.builder()
            .id(branchDto.getId())
            .city(branchDto.getCity())
            .address(branchDto.getAddress())
            .office(Office.toEntity(branchDto.getOffice()))
            .build();
    }

    public static List<Branch> toEntity(List<BranchDto> branchDtos){
        List<Branch> branches = new ArrayList<>();
        for (BranchDto branchDto : branchDtos) {
            branches.add(Branch.toEntity(branchDto));
        }
        return branches;
    }
}
