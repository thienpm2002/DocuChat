package com.thienpm.docuchat.features.document.dto;

import java.time.LocalDateTime;

import com.thienpm.docuchat.common.enums.DocumentStatus;

public record DocumentResponse(
                Long id,
                String originalName,
                Long fileSize,
                DocumentStatus status,
                LocalDateTime createdAt,
                Long chatSessionId) {

}
