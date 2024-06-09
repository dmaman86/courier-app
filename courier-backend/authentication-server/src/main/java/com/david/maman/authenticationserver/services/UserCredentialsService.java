package com.david.maman.authenticationserver.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserCredentialsService {

    private static final Logger logger = LoggerFactory.getLogger(UserCredentialsService.class);

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void createCredentials(User user) {
        logger.info("Creating credentials for user: {}", user);

        var userDb = userRepository.findByEmail(user.getEmail());
        if (!userDb.isPresent()) {
            logger.info("User not found in database, saving new user: {}", user);
            user = userRepository.save(user);
        } else {
            User existUser = userDb.get();
            logger.info("User found in database, updating user: {}", existUser);
            existUser.setName(user.getName());
            existUser.setLastName(user.getLastName());
            existUser.setPhone(user.getPhone());
            existUser.setIsActive(user.getIsActive());
            existUser.setRoles(user.getRoles());
            existUser.setEmail(user.getEmail());
            user = userRepository.save(existUser);
        }

        var userCredentials = userCredentialsRepository.findByUserEmail(user.getEmail());
        if (!userCredentials.isPresent()) {
            logger.info("User credentials not found, creating new credentials for user: {}", user);
            UserCredentials credentials = UserCredentials.builder()
                    .user(user)
                    .firstConnection(true)
                    .build();
            
            userCredentialsRepository.save(credentials);
        } else {
            logger.info("User credentials found, skipping creation for user: {}", user);
        }
    }

}
