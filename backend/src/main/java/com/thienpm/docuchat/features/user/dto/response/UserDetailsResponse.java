package com.thienpm.docuchat.features.user.dto.response;

import com.thienpm.docuchat.features.user.enums.Role;

public record UserDetailsResponse(
        Long id,
        String userName,
        String email,
        String avatarUrl,
        Role role) {

}
