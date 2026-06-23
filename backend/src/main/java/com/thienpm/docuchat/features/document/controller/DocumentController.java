package com.thienpm.docuchat.features.document.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.document.dto.DocumentResponse;
import com.thienpm.docuchat.features.document.dto.RetryDocumentResponse;
import com.thienpm.docuchat.features.document.service.DocumentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponse> uploadDocument(@RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.uploadDocument(file, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        documentService.deleteDocument(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(documentService.getDocumentById(id, userId));
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {

        Resource resource = documentService.previewDocument(id, userId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<DocumentResponse>> getAllDocuments(
            @Valid @ModelAttribute PaginationRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(documentService.getAllDocuments(request, userId));
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<RetryDocumentResponse> retryProcessDocument(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(documentService.retryProcess(userId, id));
    }

}
