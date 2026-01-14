package com.courier.userservice.objects.mappers;

import org.springframework.stereotype.Component;

import com.courier.userservice.objects.dto.RoleDto;
import com.courier.userservice.objects.entity.Role;

@Component
public class RoleMapper {

  public RoleDto toDto(Role role) {
    if (role == null) return null;

    return RoleDto.builder().id(role.getId()).name(role.getName()).build();
  }

  public Role toEntity(RoleDto roleDto) {
    if (roleDto == null) return null;

    return Role.builder().id(roleDto.getId()).name(roleDto.getName()).build();
  }
}
