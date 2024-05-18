package com.david.maman.courierserver.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.RoleRepository;
import com.david.maman.courierserver.repositories.UserRepository;
import com.david.maman.courierserver.services.KafkaProducerService;
import com.david.maman.courierserver.services.RoleService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Override
    public Optional<Role> findRole(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public Role findRoleByName(String name) {
        return roleRepository.findByName(name);
    }    

    @Override
    @Transactional
    public Role saveRole(Role role) {
        Role savedRole = roleRepository.save(role);
        kafkaProducerService.sendRole(savedRole);
        return savedRole;
    }

    @Override
    @Transactional
    public Role saveRole(RoleDto roleDto){
        Role role = Role.builder().name(roleDto.getName()).build();
        return this.saveRole(role);
    }

    @Override
    @Transactional
    public void deleteRole(Role role) {
        List<User> users = userRepository.findAllByRolesAndIsActive(role, true);

        boolean hasSingleRoleUser = users.stream().anyMatch(user -> user.getRoles().size() == 1);

        if(hasSingleRoleUser){
            throw new RuntimeException("Cannot delete role. It is the only role assigned to one or more users.");
        }

        users.forEach(user -> {
            user.getRoles().remove(role);
            userRepository.save(user);
        });

        roleRepository.delete(role);
        kafkaProducerService.sendRoleToDelete(role);
    }

    @Override
    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }
    
}

