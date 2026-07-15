package com.thienpm.docuchat.features.chat.session.service;

import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.chat.session.dto.request.CreateChatSessionRequest;
import com.thienpm.docuchat.features.chat.session.dto.request.UpdateChatSessionRequest;
import com.thienpm.docuchat.features.chat.session.dto.response.ChatSessionResponse;

public interface ChatSessionService {
    ChatSessionResponse createSession(Long userId, CreateChatSessionRequest request);

    ChatSessionResponse getSession(Long userId, Long chatSessionId);

    ChatSessionResponse updateSession(Long userId, Long chatSessionId, UpdateChatSessionRequest request);

    PaginationResponse<ChatSessionResponse> getChatSessions(PaginationRequest request, Long userId);

    void deleteChatSession(Long userId, Long chatSessionId);
}
