package com.david.maman.authenticationserver.services.impl;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.authenticationserver.helpers.CustomUserDetails;
import com.david.maman.authenticationserver.helpers.TokenType;
import com.david.maman.authenticationserver.models.dto.AuthResponse;
import com.david.maman.authenticationserver.models.dto.PublicKeyRequest;
import com.david.maman.authenticationserver.models.dto.TokenRequest;
import com.david.maman.authenticationserver.models.dto.TokenResponse;
import com.david.maman.authenticationserver.models.dto.UserCredentialsPassword;
import com.david.maman.authenticationserver.models.entities.Token;
import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.TokenRepository;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.services.AuthService;
import com.david.maman.authenticationserver.services.JwtService;
import com.david.maman.authenticationserver.services.TokenFeignClient;

import jakarta.servlet.http.Cookie;
import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private TokenFeignClient tokenFeignClient;

    @Override
    @Transactional
    public AuthResponse generateAuthTokens(CustomUserDetails credentials){
        return proccessAuthTokens(credentials, null);
    }

    @Override
    @Transactional
    public AuthResponse refreshAuthTokens(CustomUserDetails credentials, String existingRefreshToken){
        return proccessAuthTokens(credentials, existingRefreshToken);

    }

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
                            .accessTokenCookie(createCookie(TokenType.ACCESS_TOKEN, "", 0))
                            .refreshTokenCookie(createCookie(TokenType.REFRESH_TOKEN, "", 0))
                            .build();
    }

    private AuthResponse proccessAuthTokens(CustomUserDetails credentials, String existingRefreshToken){
        var user = credentials.getCredentials().getUser();
        // var jwtTokenResponse = jwtService.generateToken(credentials);
        String accessToken = requestTokenFromServer(credentials, jwtService.getAccessTokenExpirationTime());

        String refreshTokenResponse = handleRefreshToken(user, credentials, existingRefreshToken, accessToken);

        revokeAllUserTokens(user.getId(), List.of(TokenType.ACCESS_TOKEN));
        saveUserToken(user, accessToken, TokenType.ACCESS_TOKEN);

        return AuthResponse.builder()
                            .accessTokenCookie(createCookie(TokenType.ACCESS_TOKEN, accessToken, jwtService.getExpirationTime(accessToken)))
                            .refreshTokenCookie(createCookie(TokenType.REFRESH_TOKEN, refreshTokenResponse, jwtService.getExpirationTime(refreshTokenResponse)))
                            .build();
    }

    private String handleRefreshToken(User user, CustomUserDetails credentials, String existingRefreshToken, String jwtAccessToken){
        String refreshTokenResponse = existingRefreshToken;

        if(existingRefreshToken != null){
            if(jwtService.isTokenExpired(existingRefreshToken) ||
                jwtService.getExpirationTime(jwtAccessToken) >= jwtService.getExpirationTime(existingRefreshToken)){
                // refreshTokenResponse = jwtService.generateRefreshToken(credentials).getToken();
                refreshTokenResponse = requestTokenFromServer(credentials, jwtService.getRefreshTokenExpirationTime());
                revokeAllUserTokens(user.getId(), List.of(TokenType.REFRESH_TOKEN));
                saveUserToken(user, refreshTokenResponse, TokenType.REFRESH_TOKEN);
            }
        } else {
            // refreshTokenResponse = jwtService.generateRefreshToken(credentials).getToken();
            refreshTokenResponse = requestTokenFromServer(credentials, jwtService.getRefreshTokenExpirationTime());
            revokeAllUserTokens(user.getId(), List.of(TokenType.REFRESH_TOKEN));
            saveUserToken(user, refreshTokenResponse, TokenType.REFRESH_TOKEN);
        }

        return refreshTokenResponse;
    }

    private String requestTokenFromServer(CustomUserDetails credentials, long expiresIn){
        var user = credentials.getCredentials().getUser();
        return tokenFeignClient.buildToken(user, expiresIn);
    }


    @Transactional
    private void revokeAllUserTokens(Long userId, List<TokenType> tokenTypes){

        tokenTypes.forEach(tt -> {
            // Optional<Token> token = tokenRepository.findByUserIdAndTokenTypeAndIsRevoked(userId, tt, false);
            List<Token> tokens = tokenRepository.findByUserIdAndTokenTypeAndIsRevokedFalseAndIsExpiredFalse(userId, tt);

            /*token.ifPresent(t -> {
                t.setIsRevoked(true);
                t.setIsExpired(true);
                tokenRepository.save(t);
            });*/
            tokens.forEach(token -> {
                token.setIsRevoked(true);
                token.setIsExpired(true);
                tokenRepository.save(token);
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

    private Cookie createCookie(TokenType type, String token, long expiration){
        Cookie cookie = new Cookie(type.toString(), token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);        // change to true in production
        cookie.setPath("/");
        cookie.setMaxAge((int) expiration);
        return cookie;
    }
}
