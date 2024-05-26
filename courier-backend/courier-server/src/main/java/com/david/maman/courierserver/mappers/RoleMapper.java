package com.david.maman.courierserver.mappers;

import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.entities.Role;


@Component
public class RoleMapper{

    public Role toEntity(RoleDto roleDto){
        return Role.builder()
                .id(roleDto.getId())
                .name(roleDto.getName())
                .build();
    }

    public RoleDto toDto(Role role){
        return RoleDto.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .build();
    }
}

