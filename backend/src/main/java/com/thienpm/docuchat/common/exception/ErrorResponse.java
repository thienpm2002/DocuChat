package com.thienpm.docuchat.common.exception;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
                String code,
                String message,
                Map<String, String> errors) {

        public static ErrorResponse of(ErrorCode errorCode) {
                return new ErrorResponse(errorCode.getCode(), errorCode.getMessage(), null);
        }

        public static ErrorResponse of(ErrorCode errorCode, Map<String, String> errors) {
                return new ErrorResponse(
                                errorCode.getCode(),
                                errorCode.getMessage(),
                                errors);
        }
}
