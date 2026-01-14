package com.courier.userservice.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.courier.userservice.manager.RoleManager;
import com.courier.userservice.objects.dto.RoleDto;
import com.courier.userservice.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

  @Autowired private RoleManager roleManager;

  @Override
  public List<RoleDto> getRoles() {
    return roleManager.getRoles();
  }

  @Override
  public RoleDto getRole(Long id) {
    return roleManager.getRole(id);
  }

  @Override
  public RoleDto createRole(RoleDto roleDto) {
    return roleManager.createRole(roleDto);
  }

  @Override
  public RoleDto updateRole(Long id, RoleDto roleDto) {
    return roleManager.updateRole(id, roleDto);
  }

  @Override
  public void disableRole(Long id) {
    roleManager.disabledRole(id);
  }
}
