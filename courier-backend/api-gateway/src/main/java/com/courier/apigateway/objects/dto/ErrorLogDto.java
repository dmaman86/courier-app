package com.courier.apigateway.objects.dto;


import com.courier.apigateway.objects.enums.ErrorSeverity;

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

  private ErrorSeverity severity;
}
