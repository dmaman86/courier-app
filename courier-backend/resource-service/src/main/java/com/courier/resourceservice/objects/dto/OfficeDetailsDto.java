package com.courier.resourceservice.objects.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OfficeDetailsDto {
  private Long id;
  private String name;
  private List<BranchBaseDto> branches;
  private List<ContactBaseDto> contacts;
}
