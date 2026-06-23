package com.thienpm.docuchat.integration.ai.dto.request;

public record DeleteDocumentRequest(
        Long documentId,
        String storedName) {

}
