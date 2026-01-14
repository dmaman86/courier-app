package com.courier.authservice.service;

import java.util.Optional;

import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.objects.entity.UserCredential;
import com.courier.authservice.objects.request.SignUpRequest;
import com.courier.authservice.objects.request.UpdateUserCredential;

public interface UserCredentialService {

  Optional<UserCredential> getUserCredential(Long userId);

  UserCredential createUser(UserDto userDto);

  void createUserCredential(UserDto userDto);

  void signup(SignUpRequest signUpRequest);

  void updateCredential(UpdateUserCredential updateUserCredential);

  void deleteUserCredential(Long userId);
}
