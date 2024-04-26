package com.david.maman.courierserver.controllers;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.services.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courier/role")
@RequiredArgsConstructor
public class RoleController {

    protected static Logger logger = LoggerFactory.getLogger(RoleController.class);

    private final RoleService roleService;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        try{
            Optional<Role> role = roleService.findRole(id);
            if(role.isEmpty()){
                throw new Exception("Role not found");
            }
            return ResponseEntity.ok(role);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(roleService.findAllRoles());
    }

    @PostMapping("/")
    public ResponseEntity<?> saveRole(@RequestBody RoleDto roleDto) {
        try{
            Role optionalRole = roleService.findRoleByName(roleDto.getName());
            if(optionalRole != null){
                throw new Exception("Role already exists: " + roleDto.getName());
            }
            Role role = Role.toEntity(roleDto);
            roleService.saveRole(role);
            return ResponseEntity.ok(role);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updateRole(@RequestBody Role role) {
        try{
            Optional<Role> optionalRole = roleService.findRole(role.getId());
            if(optionalRole.isEmpty()){
                throw new Exception("Role not found: " + role.getId());
            }
            roleService.saveRole(role);
            return ResponseEntity.ok(role);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        try{
            Optional<Role> role = roleService.findRole(id);
            if(role.isEmpty()){
                throw new Exception("Role not found: " + id);
            }
            roleService.deleteRole(id);
            return ResponseEntity.ok("Role deleted");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}