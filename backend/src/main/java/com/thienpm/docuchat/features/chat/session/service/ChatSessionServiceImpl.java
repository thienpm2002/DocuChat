package com.thienpm.docuchat.features.chat.session.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.chat.session.dto.request.CreateChatSessionRequest;
import com.thienpm.docuchat.features.chat.session.dto.request.UpdateChatSessionRequest;
import com.thienpm.docuchat.features.chat.session.dto.response.ChatSessionResponse;
import com.thienpm.docuchat.features.chat.session.entity.ChatSession;
import com.thienpm.docuchat.features.chat.session.repository.ChatSessionRepository;
import com.thienpm.docuchat.features.document.entity.Document;
import com.thienpm.docuchat.features.document.enums.DocumentStatus;
import com.thienpm.docuchat.features.document.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {
    private final ChatSessionRepository chatSessionRepository;
    private final DocumentRepository documentRepository;

    @Override
    public ChatSessionResponse createSession(Long userId, CreateChatSessionRequest request) {
        Long documentId = request.documentId();
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        if (doc.getStatus() != DocumentStatus.READY)
            throw new AppException(ErrorCode.DOCUMENT_NOT_READY);

        if (!userId.equals(doc.getUser().getId()))
            throw new AppException(ErrorCode.DOCUMENT_ACCESS_DENIED);

        // Kiểm tra đã có session của document này chưa, có -> trả về session luôn
        ChatSession session = chatSessionRepository.findByDocument(doc).orElse(null);

        if (session != null)
            return new ChatSessionResponse(
                    session.getId(),
                    session.getTitle(),
                    documentId);

        // Chưa có -> tạo mới
        ChatSession newSession = ChatSession
                .builder()
                .document(doc)
                .user(doc.getUser())
                .title(request.title())
                .build();
        chatSessionRepository.save(newSession);

        return new ChatSessionResponse(
                newSession.getId(),
                request.title(),
                documentId);
    }

    @Override
    public ChatSessionResponse getSession(Long userId, Long chatSessionId) {
        ChatSession session = chatSessionRepository.findById(chatSessionId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_SESSION_NOT_FOUND));

        if (!userId.equals(session.getUser().getId()))
            throw new AppException(ErrorCode.CHAT_SESSION_ACCESS_DENIED);

        return new ChatSessionResponse(
                session.getId(),
                session.getTitle(),
                session.getDocument().getId());
    }

    @Transactional
    @Override
    public ChatSessionResponse updateSession(Long userId, Long chatSessionId, UpdateChatSessionRequest request) {

        ChatSession session = chatSessionRepository.findById(chatSessionId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_SESSION_NOT_FOUND));

        if (!userId.equals(session.getUser().getId()))
            throw new AppException(ErrorCode.CHAT_SESSION_ACCESS_DENIED);

        String title = request.title();
        session.setTitle(title);

        return new ChatSessionResponse(
                chatSessionId,
                title,
                session.getDocument().getId());
    }

    @Override
    public PaginationResponse<ChatSessionResponse> getAllSessions(PaginationRequest request, Long userId) {
        Sort sort = Sort.by(
                Sort.Direction.fromString(request.getSortDirection().name()),
                request.getSortBy().getField());

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        Page<ChatSessionResponse> page = chatSessionRepository.findChatSessionsByUserId(userId, pageable);

        return PaginationResponse.<ChatSessionResponse>builder()
                .data(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .build();
    }

    @Transactional
    @Override
    public void deleteChatSession(Long userId, Long chatSessionId) {

        ChatSession session = chatSessionRepository.findById(chatSessionId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_SESSION_NOT_FOUND));

        if (!userId.equals(session.getUser().getId()))
            throw new AppException(ErrorCode.CHAT_SESSION_ACCESS_DENIED);

        chatSessionRepository.delete(session);

    }

}
