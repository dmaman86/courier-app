package com.david.maman.courierserver.mappers;

import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
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

/*@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDto toDto(Role role);
    Role toEntity(RoleDto roleDto);

    List<RoleDto> toDto(List<Role> roles);
    List<Role> toEntity(List<RoleDto> roleDtos);

    Set<RoleDto> toDtoSet(Set<Role> roles);
    Set<Role> toEntitySet(Set<RoleDto> roleDtos);
}*/

