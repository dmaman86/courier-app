package com.david.maman.authenticationserver.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.models.entities.Token;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UserCredentialsRepository userCredentialsRepository;

    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(CustomUserDetails credentials){
        var jwtToken = jwtService.generateToken(credentials);
        var refreshToken = jwtService.generateRefreshToken(credentials);

        revokeAllUserTokens(credentials.getUser());
        saveUserToken(credentials.getUser(), jwtToken);

        return AuthResponse.builder()
                            .accessToken(jwtToken)
                            .refreshToken(refreshToken)
                            .build();
    }

    public AuthResponse refreshToken(CustomUserDetails credentials, String refreshToken){
        final String accessToken = jwtService.generateToken(credentials);
        revokeAllUserTokens(credentials.getUser());
        saveUserToken(credentials.getUser(), accessToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void updateUserCredentials(UserCredentialsPassword credentials){
        var userCredentials = userCredentialsRepository.findByUserEmail(credentials.getEmail()).orElse(null);

        if(userCredentials != null){
            userCredentials.setPassword(passwordEncoder.encode(credentials.getPassword()));
            userCredentials.setFirstConnection(false);
            userCredentialsRepository.save(userCredentials);
        }
    }
    
    private void revokeAllUserTokens(User user){
        if(user != null){
            var validUserTokens = tokenRepository.findByUserIdAndIsExpiredFalseOrIsRevokedFalse(user.getId());
            if(validUserTokens.isEmpty()) return;

            validUserTokens.forEach(token -> {
                token.setIsRevoked(true);
                token.setIsExpired(true);
            });

            tokenRepository.saveAll(validUserTokens);
        }
    }

    private void saveUserToken(User user, String jwtToken){
        if(user != null){
            var token = Token.builder()
                        .user(user)
                        .token(jwtToken)
                        .tokenType(TokenType.BEARER)
                        .isExpired(false)
                        .isRevoked(false)
                        .build();
            tokenRepository.save(token);
        }
    }
}
