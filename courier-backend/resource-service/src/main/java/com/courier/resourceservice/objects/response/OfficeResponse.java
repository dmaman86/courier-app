package com.courier.resourceservice.objects.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeResponse {
  private Long id;
  private String name;
  private Long countBranches;
  private Long countContacts;
}
