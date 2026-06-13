package com.thienpm.docuchat.features.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.thienpm.docuchat.features.auth.dto.request.LoginRequest;
import com.thienpm.docuchat.features.auth.dto.request.SignUpRequest;
import com.thienpm.docuchat.features.auth.dto.response.AuthResponse;
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
        public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request) {

                AuthResponse authResponse = authService.signUp(request);

                ResponseCookie refreshCookie = setCookie(authResponse.refreshToken());

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of(
                                                "accessToken", authResponse.accessToken(),
                                                "user", authResponse.userDetailsResponse()));
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.email(),
                                                request.password()));

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                AuthResponse authResponse = authService.generateTokens(userDetails);

                ResponseCookie refreshCookie = setCookie(authResponse.refreshToken());

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of(
                                                "accessToken", authResponse.accessToken(),
                                                "user", authResponse.userDetailsResponse()));
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

                AuthResponse authResponse = authService.refresh(refreshToken);

                ResponseCookie refreshCookie = setCookie(authResponse.refreshToken());

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of(
                                                "accessToken", authResponse.accessToken(),
                                                "user", authResponse.userDetailsResponse()));
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
