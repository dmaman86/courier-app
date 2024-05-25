package com.david.maman.courierserver.mappers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.OfficeDto;
import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.entities.Office;

/*@Mapper(componentModel = "spring")
public interface OfficeMapper{

    @Mapping(target = "branches", source = "branches")
    OfficeDto toDto(Office office);
    @Mapping(target = "branches", source = "branches")
    Office toEntity(OfficeDto officeDto);

    List<OfficeDto> toDto(List<Office> offices);
    List<Office> toEntity(List<OfficeDto> officeDtos);

    Set<OfficeDto> toDtoSet(Set<Office> offices);
    Set<Office> toEntitySet(Set<OfficeDto> officeDtos);
}*/

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
