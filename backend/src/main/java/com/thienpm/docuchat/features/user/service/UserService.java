package com.thienpm.docuchat.features.user.service;

import com.thienpm.docuchat.features.user.dto.response.UserDetailsDTO;

public interface UserService {
    UserDetailsDTO getProfile(Long userId);
}
