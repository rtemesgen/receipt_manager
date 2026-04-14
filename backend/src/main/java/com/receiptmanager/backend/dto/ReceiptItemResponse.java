package com.receiptmanager.backend.dto;

import java.math.BigDecimal;

public record ReceiptItemResponse(
        Long id,
        String itemName,
        BigDecimal quantity,
        BigDecimal price,
        BigDecimal lineTotal
) {
}
