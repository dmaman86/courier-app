package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.entities.Role;

public interface RoleService {

    Optional<Role> findRole(Long id);

    Role findRoleByName(String name);

    Role saveRole(Role role);

    Role saveRole(RoleDto roleDto);

    void deleteRole(Role role);

    List<Role> findAllRoles();
}
