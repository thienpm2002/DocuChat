package com.thienpm.docuchat.features.auth.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.thienpm.docuchat.features.auth.dto.request.SignUpRequestDTO;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO signUp(SignUpRequestDTO signUpRequest);

    AuthResponseDTO generateTokens(UserDetails userDetails);

    AuthResponseDTO refresh(String refreshToken);
}
