package com.courier.resourceservice.objects.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.courier.resourceservice.objects.dto.BranchBaseDto;
import com.courier.resourceservice.objects.dto.BranchDto;
import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Office;

@Component
public class BranchMapper {

  public BranchDto toDto(Branch branch) {
    if (branch == null) return null;

    return BranchDto.builder()
        .id(branch.getId())
        .city(branch.getCity())
        .address(branch.getAddress())
        .office(this.toOfficeBaseDto(branch.getOffice()))
        .build();
  }

  public BranchBaseDto toBaseDto(Branch branch) {
    if (branch == null) return null;

    return BranchBaseDto.builder()
        .id(branch.getId())
        .city(branch.getCity())
        .address(branch.getAddress())
        .build();
  }

  public List<BranchDto> toDtoList(List<Branch> branches) {
    if (branches == null) return null;

    return branches.stream().map(this::toDto).collect(Collectors.toList());
  }

  public List<BranchBaseDto> toBaseDtoList(List<Branch> branches) {
    if (branches == null) return null;

    return branches.stream().map(this::toBaseDto).collect(Collectors.toList());
  }

  public Branch toCreateEntity(BranchBaseDto branchBaseDto) {
    if (branchBaseDto == null) return null;

    return Branch.builder()
        .city(branchBaseDto.getCity())
        .address(branchBaseDto.getAddress())
        .build();
  }

  public Branch toEntity(BranchBaseDto branchBaseDto) {
    if (branchBaseDto == null) return null;

    Branch branch =
        Branch.builder()
            .id(branchBaseDto.getId())
            .city(branchBaseDto.getCity())
            .address(branchBaseDto.getAddress())
            .build();

    if (branchBaseDto instanceof BranchDto) {
      branch.setOffice(this.toOfficeEntity((BranchDto) branchBaseDto));
    }
    return branch;
  }

  private OfficeBaseDto toOfficeBaseDto(Office office) {
    if (office == null) return null;

    return OfficeBaseDto.builder().id(office.getId()).name(office.getName()).build();
  }

  private Office toOfficeEntity(BranchDto branchDto) {
    if (branchDto == null) return null;

    return Office.builder()
        .id(branchDto.getOffice().getId())
        .name(branchDto.getOffice().getName())
        .build();
  }
}

// @Mapper(
//     componentModel = MappingConstants.ComponentModel.SPRING,
//     uses = {OfficeMapper.class})
// public interface BranchMapper {
//
//   @Mapping(target = "office", qualifiedByName = "toBaseDto")
//   BranchDto toDto(Branch branch);
//
//   @Named("toBaseDto")
//   BranchBaseDto toBaseDto(Branch branch);
//
//   List<BranchDto> toDtoList(List<Branch> branches);
//
//   @Named("toBaseDtoList")
//   List<BranchBaseDto> toBaseDtoList(List<Branch> branches);
//
//   @Mapping(target = "contacts", ignore = true)
//   @Mapping(target = "office", ignore = true)
//   @Mapping(target = "createdAt", ignore = true)
//   @Mapping(target = "updatedAt", ignore = true)
//   @Mapping(target = "enabled", ignore = true)
//   @Mapping(target = "disabledAt", ignore = true)
//   Branch toEntity(BranchBaseDto branchDto);
//
//   @Mapping(target = "contacts", ignore = true)
//   @Mapping(target = "office", ignore = true)
//   @Mapping(target = "createdAt", ignore = true)
//   @Mapping(target = "updatedAt", ignore = true)
//   @Mapping(target = "enabled", ignore = true)
//   @Mapping(target = "disabledAt", ignore = true)
//   Branch toEntity(BranchDto branchDto);
// }
