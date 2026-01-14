package com.courier.userservice.service;

import java.util.List;

import com.courier.userservice.objects.dto.RoleDto;

public interface RoleService {
  List<RoleDto> getRoles();

  RoleDto getRole(Long id);

  RoleDto createRole(RoleDto roleDto);

  RoleDto updateRole(Long id, RoleDto roleDto);

  void disableRole(Long id);
}
