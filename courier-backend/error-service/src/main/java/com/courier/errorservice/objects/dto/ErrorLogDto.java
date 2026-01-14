package com.courier.errorservice.objects.dto;

import com.courier.errorservice.objects.enums.ErrorSeverity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLogDto {

  private String timestamp;
  private int status;
  private String error;
  private String message;
  private String exception;
  private String path;

  private ErrorSeverity severity;
}
