package com.thienpm.docuchat.features.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAccountRequest(

        @Size(min = 2, max = 30, message = "Username must be between 2 and 30 characters") @NotBlank(message = "Username is required") String userName,

        @Size(max = 255, message = "Email must not exceed 255 characters") @Email(message = "Email should be valid") @NotBlank(message = "Email is required") String email) {

}
