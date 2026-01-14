package com.courier.authservice.objects.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserCredential {
  private Long userId;
  private String currentPassword;
  private String newPassword;
}
