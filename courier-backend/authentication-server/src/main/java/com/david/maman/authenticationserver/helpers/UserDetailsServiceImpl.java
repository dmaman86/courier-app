package com.david.maman.authenticationserver.helpers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;

@Component
public class UserDetailsServiceImpl implements UserDetailsService{

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsService.class);

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        logger.debug("Entering in loadUserByUsername method");

        UserCredentials credentials = userCredentialsRepository.findByUserEmailOrUserPhone(username, username)
                                            .orElseThrow(() -> {
                                                logger.error("Credentials not found for user with email or phone: {}", username);
                                                return new UsernameNotFoundException("Credentials not found for user with email or phone: " + username);
                                            });
        if(!credentials.getUser().getIsActive()){
            throw new UsernameNotFoundException("User is not active");
        }
        logger.info("Credentials found for user with email or phone: {}", username);
        return new CustomUserDetails(credentials);
    }
}
