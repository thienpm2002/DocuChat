package com.thienpm.docuchat.features.document.event;

public record DocumentDeletedEvent(
        Long documentId,
        String storedName) {
}