package com.thienpm.docuchat.features.chat.session.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateChatSessionRequest(
        @Size(max = 100, message = "Title must not exceed 100 characters") @NotBlank(message = "Title is required") String title) {

}
