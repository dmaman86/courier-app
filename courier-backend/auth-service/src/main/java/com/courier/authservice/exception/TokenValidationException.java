package com.courier.authservice.exception;

public class TokenValidationException extends RuntimeException {

  public TokenValidationException(String message) {
    super(message);
  }
}
