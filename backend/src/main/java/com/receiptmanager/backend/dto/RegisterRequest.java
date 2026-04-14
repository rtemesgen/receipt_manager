package com.receiptmanager.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotBlank String phone,
        @NotBlank String address,
        @NotBlank String businessName,
        String businessPhone,
        String footerMessage,
        String website,
        String taxId,
        String logoUrl
) {
}
