package com.david.maman.authenticationserver.exceptions;

import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.reactive.function.client.WebClient;

import com.david.maman.authenticationserver.models.entities.ErrorLog;
import com.david.maman.authenticationserver.services.ErrorLogService;

import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionsHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionsHandler.class);

    @Autowired
    private ErrorLogService errorLogService;

    @ExceptionHandler(value = JwtException.class)
    public ResponseEntity<?> handleJwtException(JwtException e, WebRequest request){
        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, e.getMessage(), request);
        errorLogService.reportError(error);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, "You are not authorized to perform this action", request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error.getDetails());
    }

    @ExceptionHandler(value = TokenValidationException.class)
    public ResponseEntity<?> handleTokenValidationException(TokenValidationException e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, e.getMessage(), request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }

    @ExceptionHandler(value = BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, "Invalid username or password", request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error.getDetails());
    }

    @ExceptionHandler(value = EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, e.getMessage(), request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(value = EntityExistsException.class)
    public ResponseEntity<?> handleEntityExistsException(EntityExistsException e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, e.getMessage(), request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(value = ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolationException(ConstraintViolationException e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, e.getMessage(), request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleInvalidMethodArgumentException(MethodArgumentNotValidException e, WebRequest request) {

        logger.error(e.getMessage(), e);
        ErrorLog error = createErrorLog(e, e.getBindingResult().getAllErrors().get(0).getDefaultMessage(), request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error.getDetails());
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e, WebRequest request) {

        logger.error(e.getMessage(), e);

        ErrorLog error = createErrorLog(e, "An error occurred while processing your request. Please try again", request);
        errorLogService.reportError(error);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getDetails());
    }

    private ErrorLog createErrorLog(Exception e, String details, WebRequest request) {
        ErrorLog error = ErrorLog.builder()
            .message(e.getClass().getSimpleName() + " occurred")
            .details(details)
            .path(request.getDescription(false))
            .build();
        return error;
    }

}
