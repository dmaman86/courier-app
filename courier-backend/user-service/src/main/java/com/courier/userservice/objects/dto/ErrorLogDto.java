package com.courier.userservice.objects.dto;


import com.courier.userservice.objects.enums.ErrorSeverity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorLogDto {

  private String timestamp;
  private int status;
  private String error;
  private String message;
  private String path;
  private String exception;

  @Enumerated(EnumType.STRING)
  private ErrorSeverity severity;
}
