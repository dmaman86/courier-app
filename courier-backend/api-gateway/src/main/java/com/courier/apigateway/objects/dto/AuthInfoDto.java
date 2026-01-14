package com.courier.apigateway.objects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthInfoDto {
  private String publicKey;
  private String authServiceSecret;
}
