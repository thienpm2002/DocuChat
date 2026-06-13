package com.thienpm.docuchat.features.auth.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.thienpm.docuchat.features.auth.dto.request.SignUpRequest;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse signUp(SignUpRequest signUpRequest);

    AuthResponse generateTokens(UserDetails userDetails);

    AuthResponse refresh(String refreshToken);
}
