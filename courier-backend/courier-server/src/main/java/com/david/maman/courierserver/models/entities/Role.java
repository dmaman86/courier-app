package com.david.maman.courierserver.models.entities;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.david.maman.courierserver.models.dto.RoleDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public static Role toEntity(RoleDto roleDto){
        return Role.builder()
                .id(roleDto.getId())
                .name(roleDto.getName())
                .build();
    }

    public static Set<Role> toEntity(Set<RoleDto> rolesDto){
        Set<Role> rolesSet = new HashSet<>();
        rolesDto.forEach(roleDto -> rolesSet.add(Role.toEntity(roleDto)));

        return rolesSet;
    }
}
