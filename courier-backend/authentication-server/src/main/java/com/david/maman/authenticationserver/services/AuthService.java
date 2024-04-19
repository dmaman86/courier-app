package com.david.maman.authenticationserver.services;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.helpers.UserDetailsServiceImpl;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.LoginDto;
import com.david.maman.authenticationserver.models.entities.Token;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    public AuthResponse login(LoginDto loginDto){
        var user = userDetailsServiceImpl.loadUserByUsername(loginDto.getEmail());
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(loginDto.getEmail());
        saveUserToken(loginDto.getEmail(), jwtToken);

        return AuthResponse.builder()
                            .accessToken(jwtToken)
                            .refreshToken(refreshToken)
                            .build();
    }

    public AuthResponse refreshToken(UserDetails user, String refreshToken){
        final String accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getUsername());
        saveUserToken(user.getUsername(), accessToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void logout(String token){
        var storedToken = tokenRepository.findByToken(token).orElse(null);
        if(storedToken != null){
            storedToken.setIsRevoked(true);
            storedToken.setIsExpired(true);
            tokenRepository.save(storedToken);
        }
    }
    

    private void revokeAllUserTokens(String email){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()){
            var validUserTokens = tokenRepository.findByUserIdAndIsExpiredFalseOrIsRevokedFalse(user.get().getId());
            if(validUserTokens.isEmpty()) return;

            validUserTokens.forEach(token -> {
                token.setIsRevoked(true);
                token.setIsExpired(true);
            });

            tokenRepository.saveAll(validUserTokens);
        }
    }

    private void saveUserToken(String email, String jwtToken){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()){
            var token = Token.builder()
                        .user(user.get())
                        .token(jwtToken)
                        .tokenType(TokenType.BEARER)
                        .isExpired(false)
                        .isRevoked(false)
                        .build();
            tokenRepository.save(token);
        }
    }
}
