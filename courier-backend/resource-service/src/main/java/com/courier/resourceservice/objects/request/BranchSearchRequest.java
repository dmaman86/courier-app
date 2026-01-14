package com.courier.resourceservice.objects.request;

import java.util.List;

import com.courier.resourceservice.objects.dto.OfficeBaseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchSearchRequest {
  private String address;
  private List<OfficeBaseDto> offices;
  private List<String> cities;
}
