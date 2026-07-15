package com.thienpm.docuchat.features.document.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.document.dto.DocumentResponse;
import com.thienpm.docuchat.features.document.dto.RetryDocumentResponse;
import com.thienpm.docuchat.features.document.entity.Document;
import com.thienpm.docuchat.features.document.enums.DocumentStatus;
import com.thienpm.docuchat.features.document.event.DocumentCreatedEvent;
import com.thienpm.docuchat.features.document.event.DocumentDeletedEvent;
import com.thienpm.docuchat.features.document.repository.DocumentRepository;
import com.thienpm.docuchat.features.user.entity.User;
import com.thienpm.docuchat.features.user.repository.UserRepository;
import com.thienpm.docuchat.storage.enums.StorageType;
import com.thienpm.docuchat.storage.service.FileStorageService;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
        private final DocumentRepository documentRepository;
        private final FileStorageService fileStorageService;
        private final UserRepository userRepository;
        private final ApplicationEventPublisher eventPublisher;

        @Transactional
        @Override
        public DocumentResponse uploadDocument(MultipartFile file, Long userId) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                String storedName = fileStorageService.store(file, StorageType.DOCUMENT);

                Long fileSize = file.getSize();
                String originalName = file.getOriginalFilename();
                String fileType = file.getContentType();

                try {
                        Document document = Document.builder()
                                        .user(user)
                                        .storedName(storedName)
                                        .fileSize(fileSize)
                                        .fileType(fileType)
                                        .originalName(originalName)
                                        .status(DocumentStatus.PROCESSING)
                                        .build();
                        documentRepository.save(document);

                        Long documentId = document.getId();

                        // Event Call Ai service after transaction commit
                        eventPublisher.publishEvent(
                                        new DocumentCreatedEvent(
                                                        userId,
                                                        documentId,
                                                        storedName,
                                                        originalName));

                        log.info("Document uploaded successfully: documentId={}, userId={}",
                                        documentId, userId);
                        // Response client
                        return new DocumentResponse(
                                        documentId,
                                        originalName,
                                        fileSize,
                                        document.getStatus(),
                                        document.getCreatedAt(),
                                        null);

                } catch (Exception e) {
                        try {
                                fileStorageService.delete(storedName, StorageType.DOCUMENT);
                        } catch (Exception ignored) {

                        }

                        throw e;
                }
        }

        @Transactional
        @Override
        public void deleteDocument(Long userId, Long documentId) {
                Document document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

                if (!userId.equals(document.getUser().getId()))
                        throw new AppException(ErrorCode.DOCUMENT_ACCESS_DENIED);

                String storedName = document.getStoredName();

                documentRepository.delete(document);

                eventPublisher.publishEvent(new DocumentDeletedEvent(documentId, storedName));

                log.info("Delete document successfully: documentId={}, userId={}",
                                documentId, userId);

        }

        @Transactional
        @Override
        public RetryDocumentResponse retryProcess(Long userId, Long documentId) {
                Document document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

                if (!userId.equals(document.getUser().getId()))
                        throw new AppException(ErrorCode.DOCUMENT_ACCESS_DENIED);

                if (document.getStatus() != DocumentStatus.FAILED) {
                        throw new AppException(ErrorCode.INVALID_DOCUMENT_STATUS);
                }

                document.setStatus(DocumentStatus.PROCESSING);
                document.setErrorMessage(null);

                eventPublisher.publishEvent(
                                new DocumentCreatedEvent(
                                                userId,
                                                documentId,
                                                document.getStoredName(),
                                                document.getOriginalName()));

                log.info(
                                "Document retry requested: documentId={}, userId={}",
                                documentId,
                                userId);

                return new RetryDocumentResponse(
                                documentId,
                                DocumentStatus.PROCESSING);
        }

        @Override
        public Resource previewDocument(Long documentId, Long userId) {
                Document document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

                if (!userId.equals(document.getUser().getId())) {
                        throw new AppException(ErrorCode.DOCUMENT_ACCESS_DENIED);
                }

                return fileStorageService.loadAsResource(
                                document.getStoredName(), StorageType.DOCUMENT);
        }

        @Override
        public PaginationResponse<DocumentResponse> getDocuments(PaginationRequest request, Long userId) {
                Sort sort = Sort.by(
                                Sort.Direction.fromString(request.getSortDirection().name()),
                                request.getSortBy().getField());

                Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

                Page<DocumentResponse> page;

                if (request.getKeyword() == null || request.getKeyword().isBlank()) {
                        page = documentRepository.findDocumentsByUserId(userId, pageable);
                } else {
                        page = documentRepository.searchByUserIdAndKeyword(
                                        request.getKeyword().trim(),
                                        userId,
                                        pageable);
                }

                return PaginationResponse.<DocumentResponse>builder()
                                .data(page.getContent())
                                .page(page.getNumber())
                                .size(page.getSize())
                                .totalPages(page.getTotalPages())
                                .totalElements(page.getTotalElements())
                                .build();
        }

}
