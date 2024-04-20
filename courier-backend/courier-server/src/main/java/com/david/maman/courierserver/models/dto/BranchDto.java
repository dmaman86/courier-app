package com.david.maman.courierserver.models.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.david.maman.courierserver.models.entities.Branch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {

    private Long id;

    private String city;

    private String address;

    private OfficeDto office;

    public static BranchDto toDto(Branch branch) {
        return BranchDto.builder()
            .id(branch.getId())
            .city(branch.getCity())
            .address(branch.getAddress())
            .office(OfficeDto.toDto(branch.getOffice()))
            .build();
    }

    public static List<BranchDto> toDto(Set<Branch> branches){
        List<BranchDto> branchDtos = new ArrayList<>();
        for (Branch branch : branches) {
            branchDtos.add(BranchDto.toDto(branch));
        }
        return branchDtos;
    }

    public static List<BranchDto> toDto(List<Branch> branches){
        List<BranchDto> branchDtos = new ArrayList<>();
        for (Branch branch : branches) {
            branchDtos.add(BranchDto.toDto(branch));
        }
        return branchDtos;
    }
}
