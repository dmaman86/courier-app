package com.courier.userservice.feignclient;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import com.courier.userservice.exception.BusinessException;
import com.courier.userservice.exception.EntityExistsException;
import com.courier.userservice.exception.EntityNotFoundException;

import feign.Response;
import feign.codec.ErrorDecoder;

@Component
public class FeignErrorDecoder implements ErrorDecoder {

  @Override
  public Exception decode(String methodKey, Response response) {
    String errorMessage =
        String.format(
            "Error in method %s with status %d: %s",
            methodKey, response.status(), response.reason());

    switch (response.status()) {
      case 400:
        return new BusinessException("Bad Request: " + errorMessage);
      case 403:
        return new AccessDeniedException("Access Denied: " + errorMessage);
      case 404:
        return new EntityNotFoundException("Resource Not Found: " + errorMessage);
      case 409:
        return new EntityExistsException("Conflict Detected: " + errorMessage);
      case 500:
        return new RuntimeException("Internal Server Error: " + errorMessage);
      default:
        return new RuntimeException("Unexpected Error: " + errorMessage);
    }
  }
}
