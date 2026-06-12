package com.thienpm.docuchat.features.auth.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.features.auth.dto.request.SignUpRequestDTO;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponseDTO;
import com.thienpm.docuchat.features.user.entity.User;
import com.thienpm.docuchat.features.user.enums.Role;
import com.thienpm.docuchat.features.user.repository.UserRepository;
import com.thienpm.docuchat.security.custom.CustomUserDetails;
import com.thienpm.docuchat.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponseDTO signUp(SignUpRequestDTO signUpRequest) {

        if (userRepository.existsByEmail(signUpRequest.email())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User newUser = User.builder()
                .email(signUpRequest.email())
                .password(passwordEncoder.encode(signUpRequest.password()))
                .username(signUpRequest.userName())
                .role(Role.USER)
                .build();

        userRepository.save(newUser);

        UserDetails userDetails = new CustomUserDetails(newUser);

        return AuthResponseDTO.of(jwtService.generateAccessToken(userDetails),
                jwtService.generateRefreshToken(userDetails));

    }

    @Override
    public AuthResponseDTO generateTokens(UserDetails userDetails) {
        return AuthResponseDTO.of(jwtService.generateAccessToken(userDetails),
                jwtService.generateRefreshToken(userDetails));
    }

    @Override
    public AuthResponseDTO refresh(String refreshToken) {
        if (refreshToken == null)
            throw new AppException(ErrorCode.UNAUTHORIZED);

        Long userId = Long.valueOf(jwtService.verifyRefreshToken(refreshToken).getSubject());

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        UserDetails userDetails = new CustomUserDetails(user);

        return generateTokens(userDetails);
    }

}
