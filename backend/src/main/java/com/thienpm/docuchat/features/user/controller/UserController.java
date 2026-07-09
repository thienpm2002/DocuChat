package com.thienpm.docuchat.features.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thienpm.docuchat.features.user.dto.request.UpdateAccountRequest;
import com.thienpm.docuchat.features.user.dto.response.UserDetailsResponse;
import com.thienpm.docuchat.features.user.dto.response.UserStatsResponse;
import com.thienpm.docuchat.features.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDetailsResponse> getMe(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(userService.getMe(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDetailsResponse> updateAccount(@AuthenticationPrincipal Long userId,
            @Valid @RequestBody UpdateAccountRequest request) {
        return ResponseEntity.ok().body(userService.updateAccount(userId, request));
    }

    @PatchMapping("/me/avatar")
    public ResponseEntity<UserDetailsResponse> updateAvatar(@AuthenticationPrincipal Long userId,
            @RequestParam("avatar") MultipartFile avatar) {
        return ResponseEntity.ok().body(userService.updateAvatar(userId, avatar));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<UserStatsResponse> getStats(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok().body(userService.getStats(userId));
    }

}
