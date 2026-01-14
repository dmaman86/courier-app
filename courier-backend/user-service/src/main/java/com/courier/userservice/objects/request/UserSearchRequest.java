package com.courier.userservice.objects.request;

import java.util.List;

import com.courier.userservice.objects.dto.BranchDto;
import com.courier.userservice.objects.dto.OfficeDto;
import com.courier.userservice.objects.dto.RoleDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSearchRequest {
  private String fullName;
  private String email;
  private String phoneNumber;
  private List<RoleDto> roles;
  private List<OfficeDto> offices;
  private List<BranchDto> branches;
  private String address;
}
