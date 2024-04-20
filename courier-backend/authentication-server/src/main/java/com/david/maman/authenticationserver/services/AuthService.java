package com.david.maman.authenticationserver.services;

import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.entities.Token;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    public AuthResponse login(CustomUserDetails user){
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthResponse.builder()
                            .accessToken(jwtToken)
                            .refreshToken(refreshToken)
                            .build();
    }

    public AuthResponse refreshToken(CustomUserDetails user, String refreshToken){
        final String accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
    
    private void revokeAllUserTokens(CustomUserDetails user){
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

    private void saveUserToken(CustomUserDetails user, String jwtToken){
        User userDb = userRepository.findById(user.getId()).orElse(null);
        if(userDb != null){
            var token = Token.builder()
                        .user(userDb)
                        .token(jwtToken)
                        .tokenType(TokenType.BEARER)
                        .isExpired(false)
                        .isRevoked(false)
                        .build();
            tokenRepository.save(token);
        }
    }
}
