package com.courier.userservice.exception;

public class BusinessException extends RuntimeException {

  public BusinessException(String message) {
    super(message);
  }
}
