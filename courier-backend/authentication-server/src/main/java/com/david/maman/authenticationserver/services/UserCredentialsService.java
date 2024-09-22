package com.david.maman.authenticationserver.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;


@Service
public class UserCredentialsService {

    private static final Logger logger = LoggerFactory.getLogger(UserCredentialsService.class);

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Transactional
    public void createCredentials(User user) {
        logger.info("Creating credentials for user: {}", user);

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
