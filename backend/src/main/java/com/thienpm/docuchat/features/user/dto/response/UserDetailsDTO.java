package com.thienpm.docuchat.features.user.dto.response;

public record UserDetailsDTO(
        Long id,
        String userName,
        String email,
        String avatarUrl) {

}
