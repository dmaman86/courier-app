package com.david.maman.courierserver.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.mappers.RoleMapper;
import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.RoleRepository;
import com.david.maman.courierserver.repositories.UserRepository;
import com.david.maman.courierserver.services.KafkaProducerService;
import com.david.maman.courierserver.services.RoleService;


@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private RoleMapper roleMapper;

    @Override
    @Transactional(readOnly = true)
    public RoleDto findRole(Long id) {
        Role role = roleRepository.findById(id).orElseThrow(
            () -> new RuntimeException("Role with id " + id + " not found")
        );
        return roleMapper.toDto(role);
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
        Role role = roleMapper.toEntity(roleDto);
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
    public List<RoleDto> findAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream().map(roleMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public Page<Role> findAllRoles(Pageable pageable){
        return roleRepository.findAll(pageable);
    }
    
}

