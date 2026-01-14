package com.courier.userservice.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.courier.userservice.objects.dto.ClientDto;
import com.courier.userservice.objects.dto.ContactDto;
import com.courier.userservice.objects.dto.UserDto;
import com.courier.userservice.objects.request.UserSearchRequest;

public interface UserService {

  Page<UserDto> getUsers(Pageable pageable);

  List<UserDto> getUsers();

  List<UserDto> getUsersByRole(String roleName);

  UserDto getUserById(Long id);

  UserDto getUserByEmailOrPhone(String email, String phoneNumber);

  UserDto createUser(UserDto userDto);

  UserDto createUser(UserDto userDto, ContactDto contactDto);

  UserDto updateUser(Long id, UserDto userDto);

  UserDto updateUser(Long id, ClientDto clientDto);

  void disableUser(Long id);

  Page<UserDto> searchUsers(String search, Pageable pageable);

  Page<UserDto> advancedSearch(UserSearchRequest request, int page, int size);
}
