package com.david.maman.authenticationserver.services;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.models.entities.UserCredentials;


public interface AuthService {

    AuthResponse generateAuthTokens(CustomUserDetails credentials);

    void updateUserCredentials(UserCredentialsPassword credentials);

    void updateUserCredentials(UserCredentials userCredentials, UserCredentialsPassword credentials);

    AuthResponse logout(CustomUserDetails credentials);
}