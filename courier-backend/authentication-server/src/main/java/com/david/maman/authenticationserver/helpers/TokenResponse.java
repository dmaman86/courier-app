package com.david.maman.authenticationserver.helpers;

public class TokenResponse {

    private String token;
    private long expirationTime;

    public TokenResponse(String token, long expirationTime) {
        this.token = token;
        this.expirationTime = expirationTime;
    }

    public String getToken() {
        return token;
    }

    public long getExpirationTime() {
        return expirationTime;
    }
}
