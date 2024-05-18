package com.david.maman.authenticationserver.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.entities.Role;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.repositories.RoleRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void saveRole(Role role){
        var roleDb = roleRepository.findById(role.getId());
        if(!roleDb.isPresent()){
            roleRepository.save(role);
        }else{
            Role existRole = roleDb.get();
            existRole.setName(role.getName());
            roleRepository.save(existRole);
        }
    }

    @Transactional
    public void deleteRole(Role role){
        List<User> users = userRepository.findAllByRolesAndIsActive(role, true);

        users.forEach(user -> {
            user.getRoles().remove(role);
            userRepository.save(user);
        });
        roleRepository.delete(role);
    }

}
