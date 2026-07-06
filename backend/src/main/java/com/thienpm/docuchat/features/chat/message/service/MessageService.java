package com.thienpm.docuchat.features.chat.message.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.chat.message.dto.request.CreateMessageRequest;
import com.thienpm.docuchat.features.chat.message.dto.response.MessageResponse;

public interface MessageService {
    PaginationResponse<MessageResponse> getAllMessages(PaginationRequest request, Long chatSessionId, Long userId);

    SseEmitter createMessage(Long chatSessionId, Long userId, CreateMessageRequest request);
}
