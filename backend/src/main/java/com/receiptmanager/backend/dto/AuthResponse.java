package com.receiptmanager.backend.dto;

public record AuthResponse(
        String token,
        String email,
        String fullName
) {
}
