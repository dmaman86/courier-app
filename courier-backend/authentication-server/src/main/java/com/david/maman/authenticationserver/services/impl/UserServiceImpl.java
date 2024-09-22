package com.david.maman.authenticationserver.services.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.repositories.UserRepository;
import com.david.maman.authenticationserver.services.UserService;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Optional<User> loadUserByEmailOrPhoneAndIsActive(String email, String phone, Boolean isActive) {
        return userRepository.findByEmailOrPhoneAndIsActive(email, phone, isActive);
    }

    @Override
    @Transactional
    public User createUser(User user){
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUser(Long userId, User user){
        User updateUser = User.builder()
                                .id(userId)
                                .name(user.getName())
                                .lastName(user.getLastName())
                                .phone(user.getPhone())
                                .email(user.getEmail())
                                .roles(user.getRoles())
                                .isActive(true)
                                .build();

        return this.createUser(updateUser);
    }
}
