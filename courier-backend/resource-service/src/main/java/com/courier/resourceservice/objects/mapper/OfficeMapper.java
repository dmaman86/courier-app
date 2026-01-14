package com.courier.resourceservice.objects.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.dto.OfficeDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Office;

@Component
public class OfficeMapper {

  @Autowired private BranchMapper branchMapper;

  public OfficeDto toDto(Office office) {
    if (office == null) return null;

    return OfficeDto.builder()
        .id(office.getId())
        .name(office.getName())
        .branches(branchMapper.toBaseDtoList(office.getBranches()))
        .build();
  }

  public OfficeBaseDto toBaseDto(Office office) {
    if (office == null) return null;

    return OfficeBaseDto.builder().id(office.getId()).name(office.getName()).build();
  }

  public List<OfficeDto> toDtoList(List<Office> offices) {
    if (offices == null) return null;

    return offices.stream().map(this::toDto).collect(Collectors.toList());
  }

  public List<OfficeBaseDto> toBaseDtoList(List<Office> offices) {
    if (offices == null) return null;

    return offices.stream().map(this::toBaseDto).collect(Collectors.toList());
  }

  public Office toCreateEntity(OfficeDto officeDto) {
    if (officeDto == null) return null;

    Office office = Office.builder().name(officeDto.getName()).build();

    if (!officeDto.getBranches().isEmpty()) {
      List<Branch> branches =
          officeDto.getBranches().stream()
              .map(branchMapper::toCreateEntity)
              .collect(Collectors.toList());
      office.setBranches(branches);
    }

    return office;
  }

  public Office toEntity(OfficeBaseDto officeBaseDto) {
    if (officeBaseDto == null) return null;

    Office office =
        Office.builder().id(officeBaseDto.getId()).name(officeBaseDto.getName()).build();

    if (officeBaseDto instanceof OfficeDto) {
      List<Branch> branches =
          ((OfficeDto) officeBaseDto)
              .getBranches().stream().map(branchMapper::toEntity).collect(Collectors.toList());
      office.setBranches(branches);
    }
    return office;
  }
}

// @Mapper(
//     componentModel = MappingConstants.ComponentModel.SPRING,
//     uses = {BranchMapper.class})
// public interface OfficeMapper {
//
//   @Mapping(target = "branches", source = "branches", qualifiedByName = "toBaseDtoList")
//   OfficeDto toDto(Office office);
//
//   @Named("toBaseDto")
//   OfficeBaseDto toBaseDto(Office office);
//
//   List<OfficeDto> toDtoList(List<Office> offices);
//
//   @Mapping(target = "branches", ignore = true)
//   @Mapping(target = "contacts", ignore = true)
//   @Mapping(target = "createdAt", ignore = true)
//   @Mapping(target = "updatedAt", ignore = true)
//   @Mapping(target = "enabled", ignore = true)
//   @Mapping(target = "disabledAt", ignore = true)
//   Office toEntity(OfficeBaseDto officeDto);
//
//   @Mapping(target = "branches", ignore = true)
//   @Mapping(target = "contacts", ignore = true)
//   @Mapping(target = "createdAt", ignore = true)
//   @Mapping(target = "updatedAt", ignore = true)
//   @Mapping(target = "enabled", ignore = true)
//   @Mapping(target = "disabledAt", ignore = true)
//   Office toEntity(OfficeDto officeDto);
// }
