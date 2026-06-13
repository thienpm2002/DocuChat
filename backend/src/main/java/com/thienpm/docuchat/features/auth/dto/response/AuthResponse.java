package com.thienpm.docuchat.features.auth.dto.response;

import com.thienpm.docuchat.features.user.dto.response.UserDetailsResponse;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserDetailsResponse userDetailsResponse) {

    public static AuthResponse of(String accessToken, String refreshToken, UserDetailsResponse userDetailsResponse) {
        return new AuthResponse(accessToken, refreshToken, userDetailsResponse);
    }
}
