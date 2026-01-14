package com.courier.userservice.exception;

public class TokenValidationException extends RuntimeException {

  public TokenValidationException(String message) {
    super(message);
  }
}
