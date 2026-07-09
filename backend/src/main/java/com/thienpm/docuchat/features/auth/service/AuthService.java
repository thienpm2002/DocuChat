package com.thienpm.docuchat.features.auth.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.thienpm.docuchat.features.auth.dto.request.SignUpRequest;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponse;
import com.thienpm.docuchat.features.auth.dto.response.RefreshTokenResponse;

public interface AuthService {
    AuthResponse signUp(SignUpRequest signUpRequest);

    AuthResponse login(UserDetails userDetails);

    RefreshTokenResponse refresh(String refreshToken);
}
