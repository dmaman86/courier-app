package com.david.maman.authenticationserver.services;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;


public interface AuthService {

    AuthResponse login(CustomUserDetails credentials);

    AuthResponse refreshToken(CustomUserDetails credentials, String refreshToken);

    void updateUserCredentials(UserCredentialsPassword credentials);

    void logout(CustomUserDetails credentials);
}