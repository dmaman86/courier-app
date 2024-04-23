package com.david.maman.courierserver.models.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.david.maman.courierserver.models.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String name;
    private String lastName;
    private String phone;
    private String email;
    private Set<RoleDto> roles;

    public static UserDto toDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .name(user.getName())
            .lastName(user.getLastName())
            .phone(user.getPhone())
            .email(user.getEmail())
            .roles(RoleDto.toDto(user.getRoles()))
            .build();
    }

    public static List<UserDto> toDto(List<User> users){
        List<UserDto> userDtos = new ArrayList<>();
        for (User user : users) {
            userDtos.add(UserDto.toDto(user));
        }
        return userDtos;
    }
}
