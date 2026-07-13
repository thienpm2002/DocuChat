package com.thienpm.docuchat.features.document.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.features.document.entity.Document;
import com.thienpm.docuchat.features.document.enums.DocumentStatus;
import com.thienpm.docuchat.features.document.repository.DocumentRepository;
import com.thienpm.docuchat.integration.ai.AiClient;
import com.thienpm.docuchat.integration.ai.dto.request.DeleteDocumentRequest;
import com.thienpm.docuchat.integration.ai.dto.request.ProcessDocumentRequest;
import com.thienpm.docuchat.storage.enums.StorageType;
import com.thienpm.docuchat.storage.service.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentProcessingService {
    private final AiClient aiClient;
    private final DocumentRepository documentRepository;
    private final FileStorageService fileStorageService;

    private void deleteChunks(Long documentId) {

        try {
            aiClient.deleteDocument(documentId);
            log.info("Vector cleanup completed: documentId={}", documentId);
        } catch (Exception ex) {
            log.warn("Failed to delete existing chunks: documentId={}", documentId);
        }
    }

    @Async
    public void processAsync(ProcessDocumentRequest request) {
        long start = System.nanoTime();
        log.info("Start processing document: documentId={}", request.documentId());

        Document document = documentRepository.findById(request.documentId())
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        deleteChunks(request.documentId());

        try {
            log.info("Sending document to AI service: documentId={}", request.documentId());
            aiClient.processDocument(request);
            log.info("AI service completed: documentId={}", request.documentId());

            document.setStatus(DocumentStatus.READY);
            document.setErrorMessage(null);

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.error("AI service returned an error for documentId={}", request.documentId(), ex);
            document.setStatus(DocumentStatus.FAILED);
            document.setErrorMessage(ex.getResponseBodyAsString());

        } catch (Exception e) {
            log.error("Unexpected error while processing documentId={}", request.documentId(), e);
            document.setStatus(DocumentStatus.FAILED);
            document.setErrorMessage("Unexpected error");
        }

        documentRepository.save(document);
        log.info(
                "Document status updated: documentId={}, status={}",
                request.documentId(),
                document.getStatus());

        long duration = (System.nanoTime() - start) / 1_000_000;

        log.info(
                "Document processing finished: documentId={}, duration={} ms",
                request.documentId(),
                duration);

    }

    @Async
    public void deleteAsync(DeleteDocumentRequest request) {

        deleteChunks(request.documentId());

        fileStorageService.delete(request.storedName(), StorageType.DOCUMENT);
    }

}
