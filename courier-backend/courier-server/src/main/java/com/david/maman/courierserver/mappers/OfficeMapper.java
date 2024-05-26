package com.david.maman.courierserver.mappers;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.OfficeDto;
import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.entities.Office;

@Component
public class OfficeMapper{

    public OfficeDto toDto(Office office){
        return OfficeDto.builder()
                        .id(office.getId())
                        .name(office.getName())
                        .branches(office.getBranches().stream()
                                    .map(branch -> {
                                        return BranchInfoDto.builder()
                                                        .id(branch.getId())
                                                        .city(branch.getCity())
                                                        .address(branch.getAddress())
                                                        .build();
                                    }).collect(Collectors.toList()))
                        .build();
    }

    public Office toEntity(OfficeDto officeDto){
        return Office.builder()
                    .id(officeDto.getId())
                    .name(officeDto.getName())
                    .build();
    }

}
