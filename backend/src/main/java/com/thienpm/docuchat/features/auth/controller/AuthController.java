package com.thienpm.docuchat.features.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.thienpm.docuchat.features.auth.dto.request.LoginRequestDTO;
import com.thienpm.docuchat.features.auth.dto.request.SignUpRequestDTO;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponseDTO;
import com.thienpm.docuchat.features.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
        private final AuthService authService;
        private final AuthenticationManager authenticationManager;
        private static final long REFRESH_COOKIE_AGE = 7 * 24 * 60 * 60;

        @PostMapping("/sign-up")
        public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequestDTO request) {

                AuthResponseDTO tokens = authService.signUp(request);

                ResponseCookie refreshCookie = setCookie(tokens.refreshToken());

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of("accessToken", tokens.accessToken()));
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.email(),
                                                request.password()));

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                AuthResponseDTO tokens = authService.generateTokens(userDetails);

                ResponseCookie refreshCookie = setCookie(tokens.refreshToken());

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of("accessToken", tokens.accessToken()));
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout() {

                ResponseCookie deleteCookie = setCookie("");

                return ResponseEntity.noContent()
                                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                                .build();
        }

        @PostMapping("/refresh")
        public ResponseEntity<?> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {

                AuthResponseDTO tokens = authService.refresh(refreshToken);

                ResponseCookie refreshCookie = setCookie(tokens.refreshToken());

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of("accessToken", tokens.accessToken()));
        }

        private ResponseCookie setCookie(String refreshToken) {
                long maxAge = refreshToken.isBlank()
                                ? 0
                                : REFRESH_COOKIE_AGE;

                return ResponseCookie.from("refreshToken", refreshToken)
                                .httpOnly(true)
                                .secure(false)
                                .path("/api/v1/auth")
                                .maxAge(maxAge)
                                .sameSite("Strict")
                                .build();
        }
}
