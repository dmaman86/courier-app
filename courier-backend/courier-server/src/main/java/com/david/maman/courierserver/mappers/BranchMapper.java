package com.david.maman.courierserver.mappers;

import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.BranchDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;

@Component
public class BranchMapper{

    public BranchDto toDto(Branch branch){
        if(branch == null)
            return null;
        return BranchDto.builder()
                        .id(branch.getId())
                        .city(branch.getCity())
                        .address(branch.getAddress())
                        .office(this.toDto(branch.getOffice()))
                        .build();
    }

    public Branch toEntity(BranchDto branchDto){
        if(branchDto == null)
            return null;
        return Branch.builder()
                    .id(branchDto.getId())
                    .city(branchDto.getCity())
                    .address(branchDto.getAddress())
                    .office(this.toEntity(branchDto.getOffice()))   
                    .build();
    }

    private OfficeInfoDto toDto(Office office){
        return OfficeInfoDto.builder()
                            .id(office.getId())
                            .name(office.getName())
                            .build();
    }

    private Office toEntity(OfficeInfoDto officeInfoDto){
        return Office.builder()
                    .id(officeInfoDto.getId())
                    .name(officeInfoDto.getName())
                    .build();
    }

    /*public Branch toEntity(BranchDto branchDto, Office office){
        return Branch.builder()
                    .id(branchDto.getId())
                    .city(branchDto.getCity())
                    .address(branchDto.getAddress())
                    .office(office)
                    .build();
    }*/

}
