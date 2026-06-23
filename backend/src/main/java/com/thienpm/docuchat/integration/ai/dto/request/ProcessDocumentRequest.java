package com.thienpm.docuchat.integration.ai.dto.request;

public record ProcessDocumentRequest(
        Long userId,
        Long documentId,
        String storedName,
        String originalName) {
}
