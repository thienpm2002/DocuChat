package com.thienpm.docuchat.features.user.service;

import org.springframework.stereotype.Service;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.features.user.dto.response.UserDetailsDTO;
import com.thienpm.docuchat.features.user.entity.User;
import com.thienpm.docuchat.features.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserDetailsDTO getProfile(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return new UserDetailsDTO(userId, user.getUsername(), user.getEmail(), user.getAvatarUrl());
    }

}
