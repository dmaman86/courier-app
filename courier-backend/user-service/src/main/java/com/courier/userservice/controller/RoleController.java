package com.courier.userservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.courier.userservice.objects.dto.RoleDto;
import com.courier.userservice.service.RoleService;

@RestController
@RequestMapping("/api/user/role")
public class RoleController {

  @Autowired private RoleService roleService;

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @GetMapping("/all")
  public ResponseEntity<List<RoleDto>> getAllRoles() {
    return ResponseEntity.ok(roleService.getRoles());
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @GetMapping("/{roleId}")
  public ResponseEntity<RoleDto> getRoleById(@PathVariable Long roleId) {
    return ResponseEntity.ok(roleService.getRole(roleId));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @PostMapping
  public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto roleDto) {
    return ResponseEntity.ok(roleService.createRole(roleDto));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @PutMapping("/{roleId}")
  public ResponseEntity<RoleDto> updateRole(
      @PathVariable Long roleId, @RequestBody RoleDto roleDto) {
    return ResponseEntity.ok(roleService.updateRole(roleId, roleDto));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @DeleteMapping("/{roleId}")
  public ResponseEntity<Void> disableRole(@PathVariable Long roleId) {
    roleService.disableRole(roleId);
    return ResponseEntity.noContent().build();
  }
}
