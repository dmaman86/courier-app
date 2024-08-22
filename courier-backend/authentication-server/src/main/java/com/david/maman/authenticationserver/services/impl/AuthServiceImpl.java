package com.david.maman.authenticationserver.services.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.LoginDto;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.models.entities.Token;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.services.AuthService;
import com.david.maman.authenticationserver.services.JwtService;

import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public AuthResponse login(CustomUserDetails credentials){

        var user = credentials.getCredentials().getUser();
        var jwtTokenResponse = jwtService.generateToken(credentials);
        var refreshTokenResponse = jwtService.generateRefreshToken(credentials);

        revokeAllUserTokens(user.getId(), List.of(TokenType.REFRESH_TOKEN, TokenType.ACCESS_TOKEN));
        saveUserToken(user, jwtTokenResponse.getToken(), TokenType.ACCESS_TOKEN);
        saveUserToken(user, refreshTokenResponse.getToken(), TokenType.REFRESH_TOKEN);

        return AuthResponse.builder()
                            .accessTokenCookie(createCookie("accessToken", jwtTokenResponse.getToken(), jwtTokenResponse.getExpirationTime()))
                            .refreshTokenCookie(createCookie("refreshToken", refreshTokenResponse.getToken(), refreshTokenResponse.getExpirationTime()))
                            .build();
    }

    /*@Override
    @Transactional
    public AuthResponse refreshToken(CustomUserDetails credentials, String refreshToken){
        var accessTokenResponse = jwtService.generateToken(credentials);
        var user = credentials.getCredentials().getUser();
        revokeAllUserTokens(user.getId(), List.of(TokenType.ACCESS_TOKEN));
        saveUserToken(user, accessTokenResponse.getToken(), TokenType.ACCESS_TOKEN);

        return AuthResponse.builder()
                .accessTokenCookie(accessToken)
                .refreshTokenCookie(refreshToken)
                .build();
    }*/

    @Override
    @Transactional
    public void updateUserCredentials(UserCredentialsPassword credentials){
        var user = userCredentialsRepository.findByUserEmail(credentials.getEmail()).get();

        user.setPassword(passwordEncoder.encode(credentials.getPasswordOne()));
        user.setFirstConnection(false);
        userCredentialsRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUserCredentials(UserCredentials userCredentials, UserCredentialsPassword credentials){
        userCredentials.setPassword(passwordEncoder.encode(credentials.getPasswordOne()));
        userCredentials.setFirstConnection(false);
        userCredentialsRepository.save(userCredentials);
    }

    @Override
    @Transactional
    public AuthResponse logout(CustomUserDetails credentials){
        var user = credentials.getCredentials().getUser();
        revokeAllUserTokens(user.getId(), List.of(TokenType.REFRESH_TOKEN, TokenType.ACCESS_TOKEN));

        return AuthResponse.builder()
                            .accessTokenCookie(createCookie("accessToken", "", 0))
                            .refreshTokenCookie(createCookie("refreshToken", "", 0))
                            .build();
    }


    @Transactional
    private void revokeAllUserTokens(Long userId, List<TokenType> tokenTypes){

        tokenTypes.forEach(tt -> {
            Optional<Token> token = tokenRepository.findByUserIdAndTokenTypeAndIsRevoked(userId, tt, false);

            token.ifPresent(t -> {
                t.setIsRevoked(true);
                t.setIsExpired(true);
                tokenRepository.save(t);
            });
        });
    }

    @Transactional
    private void saveUserToken(User user, String jwtToken, TokenType tokenType){
        var token = Token.builder()           
                    .token(jwtToken)
                    .user(user)
                    .tokenType(tokenType)
                    .isExpired(false)
                    .isRevoked(false)
                    .build();
        tokenRepository.save(token);
    }

    private HttpCookie createCookie(String type, String token, long expiration){
        return ResponseCookie.from(type, token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(expiration)
                .build();
    }
}
