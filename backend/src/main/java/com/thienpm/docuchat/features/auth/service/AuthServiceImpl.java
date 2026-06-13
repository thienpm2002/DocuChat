package com.thienpm.docuchat.features.auth.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thienpm.docuchat.common.exception.AppException;
import com.thienpm.docuchat.common.exception.ErrorCode;
import com.thienpm.docuchat.features.auth.dto.request.SignUpRequest;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponse;
import com.thienpm.docuchat.features.user.dto.response.UserDetailsResponse;
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
    public AuthResponse signUp(SignUpRequest signUpRequest) {

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

        return AuthResponse.of(
                jwtService.generateAccessToken(userDetails),

                jwtService.generateRefreshToken(userDetails),

                new UserDetailsResponse(
                        newUser.getId(),
                        newUser.getUsername(),
                        newUser.getEmail(),
                        newUser.getAvatarUrl(),
                        newUser.getRole()));

    }

    @Override
    public AuthResponse generateTokens(UserDetails userDetails) {
        User user = ((CustomUserDetails) userDetails).getUser();

        return AuthResponse.of(
                jwtService.generateAccessToken(userDetails),

                jwtService.generateRefreshToken(userDetails),

                new UserDetailsResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getAvatarUrl(),
                        user.getRole()));
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null)
            throw new AppException(ErrorCode.UNAUTHORIZED);

        Long userId = Long.valueOf(jwtService.verifyRefreshToken(refreshToken).getSubject());

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        UserDetails userDetails = new CustomUserDetails(user);

        return generateTokens(userDetails);
    }

}
