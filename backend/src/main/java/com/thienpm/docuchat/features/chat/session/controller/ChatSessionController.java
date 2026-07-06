package com.thienpm.docuchat.features.chat.session.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.chat.message.dto.request.CreateMessageRequest;
import com.thienpm.docuchat.features.chat.message.dto.response.MessageResponse;
import com.thienpm.docuchat.features.chat.message.service.MessageService;
import com.thienpm.docuchat.features.chat.session.dto.request.CreateChatSessionRequest;
import com.thienpm.docuchat.features.chat.session.dto.request.UpdateChatSessionRequest;
import com.thienpm.docuchat.features.chat.session.dto.response.ChatSessionResponse;
import com.thienpm.docuchat.features.chat.session.service.ChatSessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/chat-sessions")
@RequiredArgsConstructor
public class ChatSessionController {
    private final ChatSessionService chatSessionService;
    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ChatSessionResponse> createChatSession(@Valid @RequestBody CreateChatSessionRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.created(null).body(chatSessionService.createSession(userId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatSessionResponse> getChatSession(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(chatSessionService.getSession(userId, id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ChatSessionResponse> updateChatSession(@RequestBody UpdateChatSessionRequest request,
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(chatSessionService.updateSession(userId, id, request));
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<ChatSessionResponse>> getAllChatSessions(
            @Valid @ModelAttribute PaginationRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(chatSessionService.getAllSessions(request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChatSession(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        chatSessionService.deleteChatSession(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<PaginationResponse<MessageResponse>> getAllMessages(
            @Valid @ModelAttribute PaginationRequest request,
            @AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return ResponseEntity.ok().body(messageService.getAllMessages(request, id, userId));
    }

    @PostMapping(value = "/{id}/messages", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter askQuestion(@Valid @RequestBody CreateMessageRequest request,
            @AuthenticationPrincipal Long userId, @PathVariable Long id) {

        return messageService.createMessage(id, userId, request);
    }

}
