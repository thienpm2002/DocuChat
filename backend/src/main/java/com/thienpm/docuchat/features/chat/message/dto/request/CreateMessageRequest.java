package com.thienpm.docuchat.features.chat.message.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateMessageRequest(
        @NotBlank(message = "Content is required") String content) {
}
