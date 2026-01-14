package com.courier.userservice.objects.mappers;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.courier.userservice.objects.dto.RoleDto;
import com.courier.userservice.objects.dto.UserDto;
import com.courier.userservice.objects.entity.Role;
import com.courier.userservice.objects.entity.User;

@Component
public class UserMapper {

  @Autowired private RoleMapper roleMapper;

  public UserDto toDto(User user) {
    if (user == null) return null;

    return UserDto.builder()
        .id(user.getId())
        .email(user.getEmail())
        .phoneNumber(user.getPhoneNumber())
        .fullName(user.getFullName())
        .roles(toSetDto(user.getRoles()))
        .enabled(user.isEnabled())
        .build();
  }

  public User toEntity(UserDto userDto) {
    if (userDto == null) return null;

    return User.builder()
        .id(userDto.getId())
        .email(userDto.getEmail())
        .phoneNumber(userDto.getPhoneNumber())
        .fullName(userDto.getFullName())
        .roles(toSetEntity(userDto.getRoles()))
        .build();
  }

  private Set<RoleDto> toSetDto(Set<Role> roles) {
    return roles.stream()
        .map(
            role -> {
              return roleMapper.toDto(role);
            })
        .collect(Collectors.toSet());
  }

  private Set<Role> toSetEntity(Set<RoleDto> roles) {
    return roles.stream()
        .map(
            roleDto -> {
              return roleMapper.toEntity(roleDto);
            })
        .collect(Collectors.toSet());
  }
}
