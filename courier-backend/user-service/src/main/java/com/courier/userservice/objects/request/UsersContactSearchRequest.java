package com.courier.userservice.objects.request;

import java.util.List;

import com.courier.userservice.objects.dto.BranchDto;
import com.courier.userservice.objects.dto.OfficeDto;

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
public class UsersContactSearchRequest {
  private String fullName;
  private String phoneNumber;
  private List<OfficeDto> offices;
  private List<BranchDto> branches;
  private String address;
}
