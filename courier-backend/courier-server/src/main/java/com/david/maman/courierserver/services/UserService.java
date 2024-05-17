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

    User save(User user);

    User createUser(UserDto userDto);

    void saveClientDto(ClientDto clientDto);

    User updateUser(User user, UserDto userDto);

    void updateClient(User user, ClientDto clientDto);

    void delete(User user);

    List<UserDto> getAll();

    List<User> searchUsers(String toSearch);

    Optional<UserDto> findUserByUserDto(UserDto userDto);
}
