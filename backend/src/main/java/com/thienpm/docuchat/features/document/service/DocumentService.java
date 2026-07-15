package com.thienpm.docuchat.features.document.service;

import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.document.dto.DocumentResponse;
import com.thienpm.docuchat.features.document.dto.RetryDocumentResponse;
import org.springframework.core.io.Resource;

public interface DocumentService {
    DocumentResponse uploadDocument(MultipartFile file, Long userId);

    PaginationResponse<DocumentResponse> getDocuments(PaginationRequest request, Long userId);

    RetryDocumentResponse retryProcess(Long userId, Long documentId);

    void deleteDocument(Long userId, Long documentId);

    Resource previewDocument(Long documentId, Long userId);
}
