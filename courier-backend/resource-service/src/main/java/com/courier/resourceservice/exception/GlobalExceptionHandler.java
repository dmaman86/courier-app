package com.courier.resourceservice.exception;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.courier.resourceservice.objects.dto.ErrorLogDto;
import com.courier.resourceservice.objects.enums.ErrorSeverity;
import com.courier.resourceservice.service.EventProducerService;

import io.jsonwebtoken.JwtException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @Autowired private EventProducerService eventProducerService;

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorLogDto> handleEntityNotFoundException(
      EntityNotFoundException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.LOW, HttpStatus.NOT_FOUND, request);
  }

  @ExceptionHandler(EntityExistsException.class)
  public ResponseEntity<ErrorLogDto> handleEntityExistsException(
      EntityExistsException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.LOW, HttpStatus.CONFLICT, request);
  }

  @ExceptionHandler(BussinessRuleException.class)
  public ResponseEntity<ErrorLogDto> handleBusinessRuleViolation(
      BussinessRuleException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.MEDIUM, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(TokenValidationException.class)
  public ResponseEntity<ErrorLogDto> handleTokenValidationException(
      TokenValidationException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.HIGH, HttpStatus.UNAUTHORIZED, request);
  }

  @ExceptionHandler(PublicKeyException.class)
  public ResponseEntity<ErrorLogDto> handlePublicKeyNotAvailableException(
      PublicKeyException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.CRITICAL, HttpStatus.SERVICE_UNAVAILABLE, request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorLogDto> handleGenericException(Exception ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.CRITICAL, HttpStatus.INTERNAL_SERVER_ERROR, request);
  }

  @ExceptionHandler(JwtException.class)
  public ResponseEntity<ErrorLogDto> handleJwtException(JwtException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.HIGH, HttpStatus.UNAUTHORIZED, request);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorLogDto> handleAccessDeniedException(
      AccessDeniedException ex, WebRequest request) {
    return reportError(ex, ErrorSeverity.HIGH, HttpStatus.FORBIDDEN, request);
  }

  private ResponseEntity<ErrorLogDto> reportError(
      Exception ex, ErrorSeverity severity, HttpStatus status, WebRequest request) {
    ErrorLogDto errorLog =
        ErrorLogDto.builder()
            .timestamp(
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
            .status(status.value())
            .error(status.getReasonPhrase())
            .message(ex.getMessage())
            .exception(ex.getClass().getName())
            .path(request.getDescription(false))
            .severity(severity)
            .build();
    logger.error("Error: {}", errorLog);

    eventProducerService.sendErrorLog(errorLog);

    return new ResponseEntity<>(errorLog, status);
  }
}
