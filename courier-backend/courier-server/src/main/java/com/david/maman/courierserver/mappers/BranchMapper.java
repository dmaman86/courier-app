package com.david.maman.courierserver.mappers;

import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.BranchDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;

/*@Mapper(componentModel = "spring")
public interface BranchMapper{

    @Mapping(target = "office", source = "office")
    BranchDto toDto(Branch branch);
    @Mapping(target = "office", source = "office")
    Branch toEntity(BranchDto branchDto);

    List<BranchDto> toDto(List<Branch> branches);
    List<Branch> toEntity(List<BranchDto> branchDtos);

    Set<Branch> toEntitySet(List<BranchDto> branchDtos);

    Set<BranchDto> toDtoSet(Set<Branch> branches);
    List<BranchDto> toDtoList(Set<Branch> branchs);
    Set<Branch> toEntitySet(Set<BranchDto> branchDtos);
}*/

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
