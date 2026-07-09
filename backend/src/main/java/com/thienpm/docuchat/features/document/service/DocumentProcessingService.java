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

@Service
@RequiredArgsConstructor
public class DocumentProcessingService {
    private final AiClient aiClient;
    private final DocumentRepository documentRepository;
    private final FileStorageService fileStorageService;

    private void deleteChunks(Long documentId) {

        try {
            aiClient.deleteDocument(documentId);
        } catch (Exception ignored) {
        }
    }

    @Async
    public void processAsync(ProcessDocumentRequest request) {
        Document document = documentRepository.findById(request.documentId())
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        deleteChunks(request.documentId());

        try {
            aiClient.processDocument(request);

            document.setStatus(DocumentStatus.READY);
            document.setErrorMessage(null);

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            document.setStatus(DocumentStatus.FAILED);
            document.setErrorMessage(ex.getResponseBodyAsString());

        } catch (Exception e) {
            document.setStatus(DocumentStatus.FAILED);
            document.setErrorMessage("Unexpected error");
        }

        documentRepository.save(document);

    }

    @Async
    public void deleteAsync(DeleteDocumentRequest request) {

        deleteChunks(request.documentId());

        fileStorageService.delete(request.storedName(), StorageType.DOCUMENT);
    }

}
