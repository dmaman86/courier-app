package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.entities.User;

public interface UserService {

    Optional<User> loadUserByEmail(String email);

    UserDto loadUserDtoByEmail(String email);

    Optional<User> loadUserById(Long id);

    User createUser(UserDto userDto);

    User createClient(ClientDto clientDto);

    User updateUser(User user, UserDto userDto);

    User updateClient(User user, ClientDto clientDto);

    void delete(User user);

    List<UserDto> getAll();

    List<UserDto> searchUsers(String toSearch);

    Optional<UserDto> findUserByUserDto(UserDto userDto);
}
