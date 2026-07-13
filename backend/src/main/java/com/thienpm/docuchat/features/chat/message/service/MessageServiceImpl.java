package com.thienpm.docuchat.features.chat.message.service;

import java.util.List;
import java.util.concurrent.Executor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.common.request.PaginationRequest;
import com.thienpm.docuchat.common.response.PaginationResponse;
import com.thienpm.docuchat.features.chat.message.dto.request.CreateMessageRequest;
import com.thienpm.docuchat.features.chat.message.dto.response.MessageResponse;
import com.thienpm.docuchat.features.chat.message.dto.response.SourceResponse;
import com.thienpm.docuchat.features.chat.message.entity.Message;
import com.thienpm.docuchat.features.chat.message.enums.Sender;
import com.thienpm.docuchat.features.chat.message.repository.MessageRepository;
import com.thienpm.docuchat.features.chat.session.entity.ChatSession;
import com.thienpm.docuchat.features.chat.session.repository.ChatSessionRepository;
import com.thienpm.docuchat.integration.ai.AiClient;
import com.thienpm.docuchat.integration.ai.dto.request.ChatRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.type.TypeReference;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
        private final MessageRepository messageRepository;
        private final ChatSessionRepository chatSessionRepository;
        private final AiClient aiClient;
        private final ObjectMapper objectMapper;

        @Qualifier("chatExecutor")
        private final Executor chatExecutor;

        @Override
        public PaginationResponse<MessageResponse> getAllMessages(PaginationRequest request, Long chatSessionId,
                        Long userId) {
                ChatSession session = chatSessionRepository.findById(chatSessionId)
                                .orElseThrow(() -> new AppException(ErrorCode.CHAT_SESSION_NOT_FOUND));

                if (!userId.equals(session.getUser().getId()))
                        throw new AppException(ErrorCode.CHAT_SESSION_ACCESS_DENIED);

                Pageable pageable = PageRequest.of(
                                request.getPage(),
                                request.getSize(),
                                Sort.by(Sort.Direction.DESC, "id"));

                Page<Message> page = messageRepository.findByChatSessionId(chatSessionId, pageable);

                List<MessageResponse> messageResponses = mapMessagesToResponses(page.getContent());

                return PaginationResponse.<MessageResponse>builder()
                                .data(messageResponses)
                                .page(page.getNumber())
                                .size(page.getSize())
                                .totalPages(page.getTotalPages())
                                .totalElements(page.getTotalElements())
                                .build();
        }

        private List<MessageResponse> mapMessagesToResponses(List<Message> messages) {
                return messages.stream()
                                .map(message -> {

                                        List<SourceResponse> sources = List.of();

                                        if (message.getSources() != null && !message.getSources().isBlank()) {
                                                try {
                                                        sources = objectMapper.readValue(
                                                                        message.getSources(),
                                                                        new TypeReference<List<SourceResponse>>() {
                                                                        });
                                                } catch (Exception e) {
                                                        log.error("Failed to parse sources for message {}",
                                                                        message.getId(), e);
                                                }
                                        }

                                        return new MessageResponse(
                                                        message.getId(),
                                                        message.getContent(),
                                                        message.getSender(),
                                                        sources);
                                })
                                .toList();
        }

        @Override
        public SseEmitter createMessage(Long chatSessionId, Long userId, CreateMessageRequest request) {

                // B1. Check owner
                ChatSession session = chatSessionRepository.findById(chatSessionId)
                                .orElseThrow(() -> new AppException(ErrorCode.CHAT_SESSION_NOT_FOUND));

                if (!userId.equals(session.getUser().getId())) {
                        throw new AppException(ErrorCode.CHAT_SESSION_ACCESS_DENIED);
                }

                // B2. Save user message
                Message userMessage = Message.builder()
                                .content(request.content())
                                .chatSession(session)
                                .sender(Sender.USER)
                                .build();

                messageRepository.save(userMessage);

                // B3. Save assistant placeholder
                Message assistantMessage = Message.builder()
                                .content("")
                                .chatSession(session)
                                .sender(Sender.ASSISTANT)
                                .build();

                messageRepository.save(assistantMessage);

                log.info(
                                "Chat request started: sessionId={}, documentId={}, userMessageId={}, assistantMessageId={}",
                                chatSessionId,
                                session.getDocument().getId(),
                                userMessage.getId(),
                                assistantMessage.getId());

                // B4. SSE
                SseEmitter emitter = new SseEmitter(180_000L);
                StringBuilder fullContent = new StringBuilder();

                emitter.onTimeout(() -> {
                        log.warn(
                                        "Chat request timeout: sessionId={}",
                                        chatSessionId);
                        saveAssistantMessage(assistantMessage, fullContent);
                        emitter.complete();
                });

                emitter.onError(ex -> {
                        log.error(
                                        "SSE connection error: sessionId={}",
                                        chatSessionId,
                                        ex);

                        saveAssistantMessage(assistantMessage, fullContent);
                });

                chatExecutor.execute(() -> {

                        try {

                                ChatRequest aiRequest = new ChatRequest(
                                                session.getDocument().getId(),
                                                request.content());

                                final String[] currentEvent = { null };

                                log.info(
                                                "Sending chat request to AI service: sessionId={}, documentId={}",
                                                chatSessionId,
                                                session.getDocument().getId());

                                aiClient.streamChat(aiRequest, line -> {

                                        try {

                                                if (line == null || line.isBlank()) {
                                                        return;
                                                }

                                                if (line.startsWith("event:")) {
                                                        currentEvent[0] = line.substring(6).trim();
                                                        return;
                                                }

                                                if (!line.startsWith("data:")) {
                                                        return;
                                                }

                                                String data = line.substring(5).trim();

                                                switch (currentEvent[0]) {

                                                        case "metadata" -> {

                                                                JsonNode json = objectMapper.readTree(data);

                                                                // Lưu sources vào DB
                                                                assistantMessage.setSources(
                                                                                objectMapper.writeValueAsString(
                                                                                                json.get("sources")));

                                                                ObjectNode response = objectMapper.createObjectNode();
                                                                response.put("messageId", assistantMessage.getId());
                                                                response.set("sources", json.get("sources"));

                                                                emitter.send(SseEmitter.event()
                                                                                .name("metadata")
                                                                                .data(objectMapper.writeValueAsString(
                                                                                                response)));
                                                        }

                                                        case "token" -> {

                                                                JsonNode json = objectMapper.readTree(data);

                                                                String text = json.get("text").asText();

                                                                fullContent.append(text);

                                                                emitter.send(SseEmitter.event()
                                                                                .name("token")
                                                                                .data(data));
                                                        }

                                                        case "end" -> {

                                                                saveAssistantMessage(assistantMessage, fullContent);

                                                                log.info(
                                                                                "Chat response completed: sessionId={}, assistantMessageId={}, responseLength={}",
                                                                                chatSessionId,
                                                                                assistantMessage.getId(),
                                                                                fullContent.length());

                                                                emitter.send(SseEmitter.event()
                                                                                .name("done")
                                                                                .data("{}"));

                                                                emitter.complete();
                                                        }

                                                        case "error" -> {

                                                                saveAssistantMessage(assistantMessage, fullContent);

                                                                log.error(
                                                                                "AI returned chat error: sessionId={}, documentId={}",
                                                                                chatSessionId,
                                                                                session.getDocument().getId());

                                                                emitter.send(SseEmitter.event()
                                                                                .name("error")
                                                                                .data("{\"message\":\"An unexpected error occurred. Please try again.\"}"));

                                                                emitter.complete();
                                                        }

                                                }

                                        } catch (Exception ex) {
                                                throw new RuntimeException(ex);
                                        }

                                });

                        } catch (Exception ex) {

                                log.error(
                                                "Unexpected error while processing chat: sessionId={}",
                                                chatSessionId,
                                                ex);

                                try {
                                        saveAssistantMessage(assistantMessage, fullContent);

                                        emitter.send(SseEmitter.event()
                                                        .name("error")
                                                        .data("{\"message\":\"An unexpected error occurred. Please try again.\"}"));

                                        emitter.complete();

                                } catch (Exception ignored) {

                                        emitter.completeWithError(ignored);

                                }
                        }
                });

                return emitter;
        }

        private void saveAssistantMessage(Message assistantMessage, StringBuilder fullContent) {

                assistantMessage.setContent(
                                fullContent.length() > 0
                                                ? fullContent.toString()
                                                : "An unexpected error occurred. Please try again.");

                messageRepository.save(assistantMessage);
        }

}
