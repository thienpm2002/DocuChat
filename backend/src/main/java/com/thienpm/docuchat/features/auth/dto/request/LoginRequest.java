package com.thienpm.docuchat.features.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
                @Size(max = 255, message = "Email must not exceed 255 characters") @Email(message = "Email should be valid") @NotBlank(message = "Email is required") String email,

                @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters") @NotBlank(message = "Password is required") String password) {
}
