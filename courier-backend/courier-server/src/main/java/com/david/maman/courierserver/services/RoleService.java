package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.entities.Role;

public interface RoleService {

    Optional<Role> findRole(Long id);

    Role findRoleByName(String name);

    void saveRole(Role role);

    void deleteRole(Long id);

    List<Role> findAllRoles();
}
