package com.courier.apigateway.exceptions;

public class PublicKeyException extends RuntimeException {

  public PublicKeyException(String message) {
    super(message);
  }

  public PublicKeyException(String message, Throwable cause) {
    super(message, cause);
  }
}
