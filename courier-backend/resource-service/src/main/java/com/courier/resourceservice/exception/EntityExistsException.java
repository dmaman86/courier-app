package com.courier.resourceservice.exception;

public class EntityExistsException extends RuntimeException {
    public EntityExistsException(String message) {
      super(message);
    }
}
