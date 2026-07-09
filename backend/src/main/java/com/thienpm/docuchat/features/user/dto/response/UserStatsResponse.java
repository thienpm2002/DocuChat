package com.thienpm.docuchat.features.user.dto.response;

public record UserStatsResponse(
        Long documentCount,
        Long chatSessionCount) {

    public static UserStatsResponse of(
            Long documentCount,
            Long chatSessionCount) {

        return new UserStatsResponse(
                documentCount,
                chatSessionCount);
    }

}
