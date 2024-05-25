package com.david.maman.courierserver.mappers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;

@Component
public class UserMapper{

    public UserDto toDto(User user){
        return UserDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .roles(toDto(user.getRoles()))
                    .build();
    }


    public User toEntity(UserDto userDto){
        return User.builder()
                .id(userDto.getId())
                .name(userDto.getName())
                .lastName(userDto.getLastName())
                .phone(userDto.getLastName())
                .email(userDto.getEmail())
                .roles(toEntity(userDto.getRoles()))
                .build();
    }

    public User clientDtoToUser(ClientDto clientDto){
        return User.builder()
                .id(clientDto.getId())
                .name(clientDto.getName())
                .lastName(clientDto.getLastName())
                .phone(clientDto.getPhone())
                .email(clientDto.getEmail())
                .roles(toEntity(clientDto.getRoles()))
                .build();
    }

    public ClientDto toClientDto(User user, Contact contact){
        return ClientDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .roles(toDto(user.getRoles()))
                    .office(OfficeInfoDto.builder()
                                .id(contact.getOffice().getId())
                                .name(contact.getOffice().getName())
                                .build())
                    .branches(contact.getBranches().stream()
                                .map(branch -> {
                                    return BranchInfoDto.builder()
                                            .id(branch.getId())
                                            .city(branch.getCity())
                                            .address(branch.getAddress())
                                            .build();
                                }).collect(Collectors.toList()))
                    .build();
    }

    private Set<Role> toEntity(Set<RoleDto> roles){
        return roles.stream().map(role -> {
            return Role.builder().id(role.getId()).name(role.getName()).build();
        }).collect(Collectors.toSet());
    }

    private Set<RoleDto> toDto(Set<Role> roles){
        return roles.stream().map(role -> {
            return RoleDto.builder().id(role.getId()).name(role.getName()).build();
        }).collect(Collectors.toSet());
    }
}

/*@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(UserDto userDto);

    List<UserDto> toDto(List<User> users);
    List<User> toEntity(List<UserDto> userDtos);

    Set<UserDto> toDtoSet(Set<User> users);
    Set<User> toEntitySet(Set<UserDto> userDtos);

    void updateUserFromDto(UserDto userDto, @MappingTarget User user);

}*/

