package com.david.maman.courierserver.models.dto;

import java.util.ArrayList;
import java.util.List;

import com.david.maman.courierserver.models.entities.Office;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfficeDto {

    private Long id;
    private String name;

    private List<BranchDto> branches;

    public static OfficeDto toDto(com.david.maman.courierserver.models.entities.Office office) {
        return OfficeDto.builder()
            .id(office.getId())
            .name(office.getName())
            .branches(BranchDto.toDto(office.getBranches()))
            .build();
    }

    public static List<OfficeDto> toDto(List<Office> offices){
        List<OfficeDto> officeDtos = new ArrayList<>();
        for (Office office : offices) {
            officeDtos.add(OfficeDto.toDto(office));
        }
        return officeDtos;
    }
}
