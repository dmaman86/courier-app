package com.courier.userservice.exception;

public class EntityExistsException extends RuntimeException {

  public EntityExistsException(String message) {
    super(message);
  }
}
