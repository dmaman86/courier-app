package com.courier.userservice.objects.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactDto {

  private Long id;
  private String fullName;
  private String phoneNumber;
  private OfficeDto office;
  private List<BranchDto> branches;
}
