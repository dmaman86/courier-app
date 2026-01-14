package com.courier.authservice.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.courier.authservice.config.security.CustomUserDetails;
import com.courier.authservice.exception.BusinessException;
import com.courier.authservice.feignclient.UserServiceClient;
import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.objects.entity.UserCredential;
import com.courier.authservice.service.RedisKeyService;
import com.courier.authservice.service.UserCredentialService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

  @Autowired private UserServiceClient userServiceClient;

  @Autowired private RedisKeyService redisKeyService;

  @Autowired private UserCredentialService userCredentialService;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    String email = username.contains("@") ? username : null;
    String phoneNumber = email == null ? username : null;

    UserDto userDto = getUserFromService(email, phoneNumber);

    logger.info("User found: {}", userDto);
    Optional<UserCredential> userCredentialOptional =
        userCredentialService.getUserCredential(userDto.getId());

    UserCredential userCredential =
        (userCredentialOptional.isEmpty())
            ? userCredentialService.createUser(userDto)
            : userCredentialOptional.get();

    if (!userDto.isEnabled()) {
      userCredentialService.deleteUserCredential(userDto.getId());
      throw new BusinessException("User is disabled. Contact support.");
    }

    if (!userCredential.isEnabled()) {
      throw new BusinessException("No credentials found. Please finish registration.");
    }

    logger.info("Retrieved hashed password from DB: {}", userCredential.getPassword());

    return new CustomUserDetails(userDto, userCredential);
  }

  public UserDto getUserFromService(String email, String phoneNumber) {
    String apiKey = redisKeyService.getAuthServiceSecret();

    if (apiKey == null) {
      throw new RuntimeException("API key not ready");
    }

    UserDto userDto = userServiceClient.getUserByEmailOrPhone(email, phoneNumber, apiKey);
    if (userDto == null || userDto.getId() == null) {
      throw new UsernameNotFoundException(
          "User not found with email or phone: " + email + " " + phoneNumber);
    }
    return userDto;
  }
}
