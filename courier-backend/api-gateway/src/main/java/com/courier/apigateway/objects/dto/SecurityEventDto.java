package com.courier.apigateway.objects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityEventDto {
  private Long userId;
  // private String ip;
  private String userAgent;
}
