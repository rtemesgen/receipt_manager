package com.receiptmanager.backend.dto;

public record ReceiptSettingsDto(
        String businessName,
        String address,
        String phone,
        String thankYouMessage,
        String website,
        String taxId,
        String logoUrl
) {
}
