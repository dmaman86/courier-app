package com.david.maman.courierserver.mappers;

import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.BranchDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;

@Component
public class BranchMapper{

    public BranchDto toDto(Branch branch){

        OfficeInfoDto officeInfoDto = OfficeInfoDto.builder()
                                                        .id(branch.getOffice().getId())
                                                        .name(branch.getOffice().getName())
                                                        .build();

        return BranchDto.builder()
                        .id(branch.getId())
                        .city(branch.getCity())
                        .address(branch.getAddress())
                        .office(officeInfoDto)
                        .build();
    }

    public Branch toEntity(BranchDto branchDto, Office office){
        return Branch.builder()
                    .id(branchDto.getId())
                    .city(branchDto.getCity())
                    .address(branchDto.getAddress())
                    .office(office)
                    .build();
    }

}
