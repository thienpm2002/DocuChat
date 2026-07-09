package com.thienpm.docuchat.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // Valdation
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed"),

    // Auth
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN_EXPIRED", "Token has expired"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "TOKEN_INVALID", "Token is invalid"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "Email already exists"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "Forbidden"),

    // Login
    BAD_CREDENTIALS(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS", "Invalid credentials"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"),

    // File
    FILE_EMPTY(HttpStatus.BAD_REQUEST, "FILE_EMPTY", "Uploaded file is empty"),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE", "Only PDF files are allowed"),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "FILE_SIZE_EXCEEDED", "File size exceeds the maximum allowed limit"),
    FILE_STORAGE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_ERROR", "Failed to store file"),
    FILE_DELETE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_DELETE_ERROR", "Failed to delete file"),

    // Document
    DOCUMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "DOCUMENT_NOT_FOUND", "Document not found"),
    STORAGE_FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "STORAGE_FILE_NOT_FOUND", "File not found in storage"),
    INVALID_DOCUMENT_STATUS(HttpStatus.CONFLICT, "INVALID_DOCUMENT_STATUS",
            "Document can only be retried when status is FAILED"),
    DOCUMENT_NOT_READY(HttpStatus.CONFLICT, "DOCUMENT_NOT_READY",
            "Document is not ready for chat"),
    DOCUMENT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "DOCUMENT_ACCESS_DENIED",
            "You don't have permission to access this document"),

    // Chat
    CHAT_SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "CHAT_SESSION_NOT_FOUND", "Chat session not found"),
    CHAT_SESSION_ACCESS_DENIED(HttpStatus.FORBIDDEN, " CHAT_SESSION_ACCESS_DENIED",
            "You don't have permission to access this chat session"),
    // Databse
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Database operation failed"),

    // Server
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Internal server error");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}