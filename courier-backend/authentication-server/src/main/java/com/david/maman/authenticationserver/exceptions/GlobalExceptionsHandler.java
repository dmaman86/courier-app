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

import com.david.maman.authenticationserver.models.dto.ErrorLogDto;
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

        ErrorLogDto error = createErrorLog(e, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error.getDetails());
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, "You are not authorized to perform this action", request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error.getDetails());
    }

    @ExceptionHandler(value = TokenValidationException.class)
    public ResponseEntity<?> handleTokenValidationException(TokenValidationException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error.getDetails());
    }

    @ExceptionHandler(value = BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error.getDetails());
    }

    @ExceptionHandler(value = EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.getDetails());
    }

    @ExceptionHandler(value = EntityExistsException.class)
    public ResponseEntity<?> handleEntityExistsException(EntityExistsException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error.getDetails());
    }

    @ExceptionHandler(value = ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolationException(ConstraintViolationException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error.getDetails());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleInvalidMethodArgumentException(MethodArgumentNotValidException e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, e.getBindingResult().getAllErrors().get(0).getDefaultMessage(), request);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error.getDetails());
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e, WebRequest request) {

        ErrorLogDto error = createErrorLog(e, "An error occurred while processing your request. Please try again", request);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getDetails());
    }

    private ErrorLogDto createErrorLog(Exception e, String details, WebRequest request) {
        ErrorLogDto error = ErrorLogDto.builder()
            .message(e.getClass().getSimpleName() + " occurred")
            .details(details)
            .path(request.getDescription(false))
            .build();

        errorLogService.reportError(error);

        return error;
    }

}
