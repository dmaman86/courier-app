package com.david.maman.courierserver.models.dto;

import java.util.HashSet;
import java.util.Set;

import com.david.maman.courierserver.models.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleDto {

    private Long id;
    private String name;

    public static RoleDto toDto(Role role){
        return RoleDto.builder()
                .id(role.getId())
                .name(role.getName())
                .build();
    }

    public static Set<RoleDto> toDto(Set<Role> roles){
        Set<RoleDto> rolesDtosSet = new HashSet<>();
        roles.forEach(role -> rolesDtosSet.add(RoleDto.toDto(role)));

        return rolesDtosSet;
    }

}
