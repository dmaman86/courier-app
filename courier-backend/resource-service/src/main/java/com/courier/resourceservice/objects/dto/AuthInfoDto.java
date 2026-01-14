package com.courier.resourceservice.objects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthInfoDto {

  private String publicKey;
  private String authServiceSecret;
}
