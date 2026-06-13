package com.thienpm.docuchat.features.user.service;

import com.thienpm.docuchat.features.user.dto.response.UserDetailsResponse;

public interface UserService {
    UserDetailsResponse getProfile(Long userId);
}
