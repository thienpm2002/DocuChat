package com.thienpm.docuchat.features.document.event;

public record DocumentCreatedEvent(
        Long userId,
        Long documentId,
        String storedName,
        String originalName) {

}
