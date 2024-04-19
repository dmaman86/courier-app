package com.david.maman.authenticationserver.helpers;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.repositories.UserRepository;

@Component
public class UserDetailsServiceImpl implements UserDetailsService{

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        logger.debug("Entering in loadUserByUsername method");
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isEmpty()){
            logger.error("User not found with email: " + email);
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        logger.info("User Authenticated Successfully");
        logger.info(user.get().toString());
        return new CustomUserDetails(user.get());
    }
}
