package com.courier.resourceservice.exception;

public class TokenValidationException extends RuntimeException {
    public TokenValidationException(String message) {
      super(message);
    }
}
