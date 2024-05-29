package com.david.maman.courierserver.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.entities.Role;

public interface RoleService {

    RoleDto findRole(Long id);

    Role findRoleByName(String name);

    Role saveRole(Role role);

    Role saveRole(RoleDto roleDto);

    void deleteRole(Role role);

    List<RoleDto> findAllRoles();

    Page<Role> findAllRoles(Pageable pageable);
}
