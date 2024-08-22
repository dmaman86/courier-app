package com.david.maman.authenticationserver.services;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.models.entities.UserCredentials;


public interface AuthService {

    AuthResponse login(CustomUserDetails credentials);

    // AuthResponse refreshToken(CustomUserDetails credentials, String refreshToken);

    void updateUserCredentials(UserCredentialsPassword credentials);

    void updateUserCredentials(UserCredentials userCredentials, UserCredentialsPassword credentials);

    AuthResponse logout(CustomUserDetails credentials);
}