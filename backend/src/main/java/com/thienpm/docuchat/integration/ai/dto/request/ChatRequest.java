package com.thienpm.docuchat.integration.ai.dto.request;

public record ChatRequest(
        Long documentId,
        String question) {
}
