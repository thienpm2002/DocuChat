package com.thienpm.docuchat.features.document.listener;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.thienpm.docuchat.features.document.event.DocumentCreatedEvent;
import com.thienpm.docuchat.features.document.event.DocumentDeletedEvent;
import com.thienpm.docuchat.features.document.service.DocumentProcessingService;
import com.thienpm.docuchat.integration.ai.dto.request.DeleteDocumentRequest;
import com.thienpm.docuchat.integration.ai.dto.request.ProcessDocumentRequest;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DocumentEventHandler {

    private final DocumentProcessingService documentProcessingService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDocumentCreated(DocumentCreatedEvent event) {
        ProcessDocumentRequest request = new ProcessDocumentRequest(
                event.userId(),
                event.documentId(),
                event.storedName(),
                event.originalName());
        documentProcessingService.processAsync(request);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDocumentDeleted(DocumentDeletedEvent event) {
        DeleteDocumentRequest request = new DeleteDocumentRequest(
                event.documentId(),
                event.storedName());
        documentProcessingService.deleteAsync(request);
    }
}