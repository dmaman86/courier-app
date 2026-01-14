package com.courier.userservice.manager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.courier.userservice.exception.EntityExistsException;
import com.courier.userservice.exception.EntityNotFoundException;
import com.courier.userservice.objects.dto.RoleDto;
import com.courier.userservice.objects.entity.Role;
import com.courier.userservice.objects.mappers.RoleMapper;
import com.courier.userservice.repository.RoleRepository;
import com.courier.userservice.repository.UserRepository;

@Component
public class RoleManager {

  @Autowired private RoleRepository roleRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private RoleMapper roleMapper;

  @Transactional(readOnly = true)
  public List<RoleDto> getRoles() {
    return roleRepository.findByEnabledTrue().stream()
        .map(roleMapper::toDto)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public RoleDto getRole(Long id) {
    return roleRepository
        .findById(id)
        .filter(Role::isEnabled)
        .map(roleMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Role not found: " + id));
  }

  @Transactional
  public RoleDto createRole(RoleDto roleDto) {
    if (roleRepository.existsByNameAndEnabledTrue(roleDto.getName())) {
      throw new EntityExistsException("Role already exists: " + roleDto.getName());
    }

    Role role = Role.builder().name(roleDto.getName()).enabled(true).build();

    return roleMapper.toDto(roleRepository.save(role));
  }

  @Transactional
  public RoleDto updateRole(Long roleId, RoleDto roleDto) {
    Role role =
        roleRepository
            .findByIdAndEnabledTrue(roleId)
            .orElseThrow(() -> new EntityNotFoundException("Role not found: " + roleId));

    boolean exists = roleRepository.existsByNameAndEnabledTrue(roleDto.getName());
    if (!role.getId().equals(roleId) && exists) {
      throw new EntityExistsException("Role already exists: " + roleDto.getName());
    }

    role.setName(roleDto.getName());
    return roleMapper.toDto(roleRepository.save(role));
  }

  @Transactional
  public void disabledRole(Long roleId) {
    Role role =
        roleRepository
            .findByIdAndEnabledTrue(roleId)
            .orElseThrow(() -> new EntityNotFoundException("Role not found: " + roleId));

    long userCount = userRepository.countByRolesIdAndEnabledTrue(roleId);

    if (userCount > 0) {
      throw new IllegalStateException("Role has users associated with it: " + role.getName());
    }

    role.setEnabled(false);
    role.setDisabledAt(LocalDateTime.now());
    roleRepository.save(role);
  }
}
