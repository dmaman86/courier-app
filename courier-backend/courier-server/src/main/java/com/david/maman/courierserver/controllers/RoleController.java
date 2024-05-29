package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.mappers.RoleMapper;
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

    private final RoleMapper roleMapper;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(roleService.findRole(id));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(roleService.findAllRoles());
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllRoles(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Role> rolesPage = roleService.findAllRoles(pageable);
        List<RoleDto> rolesDto = rolesPage.getContent().stream().map(roleMapper::toDto).collect(Collectors.toList());
        Page<RoleDto> rolesDtoPage = new PageImpl<>(rolesDto, pageable, rolesPage.getTotalElements());
        return ResponseEntity.ok(rolesDtoPage);
    }

    @PostMapping("/")
    public ResponseEntity<?> saveRole(@RequestBody RoleDto roleDto) {
        try{
            if(roleService.findRoleByName(roleDto.getName()) != null){
                throw new Exception("Role already exists: " + roleDto.getName());
            }
            Role role = roleService.saveRole(roleDto);
            return ResponseEntity.ok(role);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updateRole(@RequestBody Role role) {
        try{
            Role updateRole = roleService.saveRole(role);
            return ResponseEntity.ok(roleMapper.toDto(updateRole));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        try{
            // Role role = roleService.findRole(id).orElseThrow(() -> new Exception("Role not found: " + id));
            roleService.deleteRole(roleMapper.toEntity(roleService.findRole(id)));
            return ResponseEntity.ok("Role deleted");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
