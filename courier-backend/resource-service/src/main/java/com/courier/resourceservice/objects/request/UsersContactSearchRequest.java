package com.courier.resourceservice.objects.request;

import java.util.List;

import com.courier.resourceservice.objects.dto.BranchBaseDto;
import com.courier.resourceservice.objects.dto.OfficeBaseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UsersContactSearchRequest {
  private String fullName;
  private String phoneNumber;
  private List<OfficeBaseDto> offices;
  private List<BranchBaseDto> branches;
  private String address;
}
