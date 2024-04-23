package com.david.maman.courierserver.helpers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


import com.david.maman.courierserver.models.entities.UserCredentials;
import com.david.maman.courierserver.repositories.UserCredentialsRepository;

@Component
public class UserDetatailsServiceImpl implements UserDetailsService{

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsService.class);

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        logger.debug("Entering in loadUserByUsername method");

        UserCredentials credentials = userCredentialsRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: " + email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        logger.info("Credentials found for user with email: {}", email);
        return new CustomUserDetails(credentials);
    }
}
