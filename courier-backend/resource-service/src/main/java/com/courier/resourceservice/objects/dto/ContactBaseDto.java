package com.courier.resourceservice.objects.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ContactBaseDto {
  private Long id;
  private String fullName;
  private String phoneNumber;
  private OfficeBaseDto office;
}
