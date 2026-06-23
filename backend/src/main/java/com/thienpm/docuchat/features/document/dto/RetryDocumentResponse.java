package com.thienpm.docuchat.features.document.dto;

import com.thienpm.docuchat.common.enums.DocumentStatus;

public record RetryDocumentResponse(
        Long id,
        DocumentStatus status) {
}
