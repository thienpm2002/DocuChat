package com.thienpm.docuchat.features.user.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.features.chat.session.repository.ChatSessionRepository;
import com.thienpm.docuchat.features.document.repository.DocumentRepository;
import com.thienpm.docuchat.features.user.dto.request.UpdateAccountRequest;
import com.thienpm.docuchat.features.user.dto.response.UserDetailsResponse;
import com.thienpm.docuchat.features.user.dto.response.UserStatsResponse;
import com.thienpm.docuchat.features.user.entity.User;
import com.thienpm.docuchat.features.user.repository.UserRepository;
import com.thienpm.docuchat.storage.enums.StorageType;
import com.thienpm.docuchat.storage.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final DocumentRepository documentRepository;
    private final ChatSessionRepository chatSessionRepository;

    @Override
    public UserDetailsResponse getMe(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String avatarUrl = null;
        if (user.getAvatarUrl() != null) {
            avatarUrl = "/storage/avatars/" + user.getAvatarUrl();
        }

        return new UserDetailsResponse(
                userId,
                user.getUserName(),
                user.getEmail(),
                avatarUrl,
                user.getRole());
    }

    @Override
    public UserDetailsResponse updateAccount(Long userId, UpdateAccountRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if the new email is already taken by another user
        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Update user details
        user.setUserName(request.userName());
        user.setEmail(request.email());
        userRepository.save(user);

        String avatarUrl = null;
        if (user.getAvatarUrl() != null) {
            avatarUrl = "/storage/avatars/" + user.getAvatarUrl();
        }

        return new UserDetailsResponse(
                userId,
                user.getUserName(),
                user.getEmail(),
                avatarUrl,
                user.getRole());
    }

    @Override
    public UserDetailsResponse updateAvatar(Long userId, MultipartFile avatar) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        String oldAvatar = user.getAvatarUrl();

        // Store the avatar file
        String newAvatar = fileStorageService.store(avatar, StorageType.AVATAR);

        // Update user's avatar URL
        user.setAvatarUrl(newAvatar);
        userRepository.save(user);

        // Delete the old avatar file if it exists
        if (oldAvatar != null && !oldAvatar.isEmpty()) {
            fileStorageService.delete(oldAvatar, StorageType.AVATAR);
        }

        String avatarUrl = "/storage/avatars/" + newAvatar;

        return new UserDetailsResponse(
                userId,
                user.getUserName(),
                user.getEmail(),
                avatarUrl,
                user.getRole());
    }

    @Override
    public UserStatsResponse getStats(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Long documentCount = documentRepository.countByUserId(user.getId());
        Long chatSessionCount = chatSessionRepository.countByUserId(user.getId());

        return UserStatsResponse.of(
                documentCount,
                chatSessionCount);
    }

}
