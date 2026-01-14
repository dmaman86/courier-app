package com.courier.authservice.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.courier.authservice.exception.BusinessException;
import com.courier.authservice.exception.EntityExistsException;
import com.courier.authservice.exception.EntityNotFoundException;
import com.courier.authservice.feignclient.UserServiceClient;
import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.objects.entity.UserCredential;
import com.courier.authservice.objects.request.SignUpRequest;
import com.courier.authservice.objects.request.UpdateUserCredential;
import com.courier.authservice.repository.RefreshTokenRepository;
import com.courier.authservice.repository.UserCredentialRepository;
import com.courier.authservice.service.RedisKeyService;
import com.courier.authservice.service.UserCredentialService;

@Service
public class UserCredentialServiceImpl implements UserCredentialService {

  private static final Logger logger = LoggerFactory.getLogger(UserCredentialServiceImpl.class);

  @Autowired private UserCredentialRepository userCredentialRepository;

  @Autowired private UserServiceClient userServiceClient;

  @Autowired private PasswordEncoder passwordEncoder;

  @Autowired private RedisKeyService redisKeyService;

  @Autowired private RefreshTokenRepository refreshTokenRepository;

  @Override
  @Transactional(readOnly = true)
  public Optional<UserCredential> getUserCredential(Long userId) {
    return userCredentialRepository.findByUserId(userId);
  }

  @Override
  @Transactional
  public UserCredential createUser(UserDto userDto) {
    if (userCredentialRepository.existsByUserId(userDto.getId())) {
      throw new EntityExistsException(
          "User credential already exists for user id: " + userDto.getId());
    }

    UserCredential userCredential =
        UserCredential.builder().userId(userDto.getId()).password(null).build();

    return userCredentialRepository.save(userCredential);
  }

  @Override
  @Transactional
  public void createUserCredential(UserDto userDto) {
    if (userCredentialRepository.existsByUserId(userDto.getId())) {
      throw new EntityExistsException(
          "User credential already exists for user id: " + userDto.getId());
    }

    UserCredential userCredential =
        UserCredential.builder().userId(userDto.getId()).password(null).build();

    userCredentialRepository.save(userCredential);
  }

  @Override
  @Transactional
  public void signup(SignUpRequest signUpRequest) {

    String apiKey = redisKeyService.getAuthServiceSecret();
    if (apiKey == null) {
      throw new RuntimeException("API key not found");
    }

    UserDto userDto =
        userServiceClient.getUserByEmailOrPhone(
            signUpRequest.getEmail(), signUpRequest.getPhoneNumber(), apiKey);
    if (userDto == null || userDto.getId() == null) {
      throw new EntityNotFoundException("User not found");
    }

    Optional<UserCredential> userCredentialOptional =
        userCredentialRepository.findByUserId(userDto.getId());

    if (userCredentialOptional.isPresent() && userCredentialOptional.get().isEnabled()) {
      throw new BusinessException("Password already set for user id: " + userDto.getId());
    }

    UserCredential userCredential =
        userCredentialOptional.orElseGet(() -> createUserCredential(userDto.getId()));
    userCredential.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
    userCredential.setEnabled(true);

    userCredentialRepository.save(userCredential);
  }

  private UserCredential createUserCredential(Long userId) {
    logger.warn("Inconsistency detected: Creating missing user credential for user id: {}", userId);
    UserCredential userCredential = UserCredential.builder().userId(userId).password(null).build();
    return userCredentialRepository.save(userCredential);
  }

  @Override
  @Transactional
  public void updateCredential(UpdateUserCredential updateUserCredential) {
    UserCredential userCredential =
        userCredentialRepository
            .findByUserId(updateUserCredential.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("User credential not found"));

    logger.info("Raw password received: {}", updateUserCredential.getCurrentPassword());
    logger.info("Encoded password from DB: {}", userCredential.getPassword());

    if (!passwordEncoder.matches(
        updateUserCredential.getCurrentPassword(), userCredential.getPassword())) {
      throw new BusinessException("Current password is incorrect");
    }

    userCredential.setPassword(passwordEncoder.encode(updateUserCredential.getNewPassword()));
    userCredentialRepository.save(userCredential);
  }

  @Override
  @Transactional
  public void deleteUserCredential(Long userId) {

    userCredentialRepository
        .findByUserId(userId)
        .ifPresent(
            userCredential -> {
              refreshTokenRepository.deleteByUserId(userId);
              logger.info("Refresh token deleted for user id: {}", userId);
              userCredentialRepository.delete(userCredential);
              logger.info("User credential deleted for user id: {}", userId);
            });
  }
}
