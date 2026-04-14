package com.receiptmanager.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ReceiptResponse(
        Long id,
        String customerName,
        LocalDate date,
        String paymentMethod,
        BigDecimal total,
        LocalDateTime createdAt,
        List<ReceiptItemResponse> items,
        ReceiptSettingsDto settings
) {
}
