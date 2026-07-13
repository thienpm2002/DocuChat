package com.thienpm.docuchat.common.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        log.warn("Validation failed: {}", errors);

        ErrorResponse response = ErrorResponse.of(ErrorCode.VALIDATION_ERROR, errors);

        return ResponseEntity.status(ErrorCode.VALIDATION_ERROR.getStatus().value()).body(response);
    }

    // Login fail
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuth(AuthenticationException ex) {

        log.warn("Authentication failed");

        ErrorResponse response = ErrorResponse.of(ErrorCode.BAD_CREDENTIALS);

        return ResponseEntity.status(ErrorCode.BAD_CREDENTIALS.getStatus().value()).body(response);
    }

    // App business logic exception
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {

        log.warn("Business exception: {}", ex.getErrorCode());

        ErrorCode errorCode = ex.getErrorCode();

        ErrorResponse response = ErrorResponse.of(errorCode);

        return ResponseEntity.status(errorCode.getStatus().value()).body(response);
    }

    // Database
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDatabase(DataAccessException ex) {

        log.error("Database error occurred", ex);

        ErrorResponse response = ErrorResponse.of(ErrorCode.DATABASE_ERROR);

        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus().value()).body(response);
    }

    // Server
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex) {

        log.error("Unexpected error occurred", ex);

        ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);

        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus().value()).body(response);
    }
}
