package com.courier.authservice.objects.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

  private Long id;
  private String fullName;
  private String email;
  private String phoneNumber;
  private Set<RoleDto> roles;
  private boolean enabled;
}
