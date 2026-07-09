package com.thienpm.docuchat.features.user.service;

import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.features.user.dto.request.UpdateAccountRequest;
import com.thienpm.docuchat.features.user.dto.response.UserDetailsResponse;
import com.thienpm.docuchat.features.user.dto.response.UserStatsResponse;

public interface UserService {
    UserDetailsResponse getMe(Long userId);

    UserDetailsResponse updateAccount(Long userId, UpdateAccountRequest request);

    UserDetailsResponse updateAvatar(Long userId, MultipartFile avatar);

    UserStatsResponse getStats(Long userId);

}
