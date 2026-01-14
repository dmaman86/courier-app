package com.courier.authservice.exception;

public class EntityExistsException extends RuntimeException {

  public EntityExistsException(String message) {
    super(message);
  }
}
