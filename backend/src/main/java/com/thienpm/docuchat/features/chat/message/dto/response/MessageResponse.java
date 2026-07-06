package com.thienpm.docuchat.features.chat.message.dto.response;

import java.util.List;

import com.thienpm.docuchat.features.chat.message.enums.Sender;

public record MessageResponse(
                Long id,
                String content,
                Sender sender,
                List<SourceResponse> sources) {

}
