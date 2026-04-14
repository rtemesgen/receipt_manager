package com.receiptmanager.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record ReceiptRequest(
        @NotBlank String customerName,
        @NotNull LocalDate date,
        @NotBlank String paymentMethod,
        @NotEmpty List<@Valid ReceiptItemRequest> items
) {
}
