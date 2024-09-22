package com.david.maman.authenticationserver.services;

import java.util.Optional;

import com.david.maman.authenticationserver.models.entities.User;

public interface UserService {

    Optional<User> loadUserByEmailOrPhoneAndIsActive(String email, String phone, Boolean isActive);

    User createUser(User user);

    User updateUser(Long userId, User user);
}
