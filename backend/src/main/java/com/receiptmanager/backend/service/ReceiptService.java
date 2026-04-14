package com.receiptmanager.backend.service;

import com.receiptmanager.backend.dto.ReceiptItemResponse;
import com.receiptmanager.backend.dto.ReceiptRequest;
import com.receiptmanager.backend.dto.ReceiptResponse;
import com.receiptmanager.backend.dto.ReceiptSettingsDto;
import com.receiptmanager.backend.model.Receipt;
import com.receiptmanager.backend.model.ReceiptItem;
import com.receiptmanager.backend.model.User;
import com.receiptmanager.backend.repository.ReceiptRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptSettingsService receiptSettingsService;

    public ReceiptService(ReceiptRepository receiptRepository, ReceiptSettingsService receiptSettingsService) {
        this.receiptRepository = receiptRepository;
        this.receiptSettingsService = receiptSettingsService;
    }

    @Transactional
    public ReceiptResponse createReceipt(User user, ReceiptRequest request) {
        Receipt receipt = new Receipt();
        receipt.setUser(user);
        receipt.setCreatedAt(LocalDateTime.now());
        applyReceiptRequest(receipt, request);
        Receipt saved = receiptRepository.save(receipt);
        return toResponse(saved, receiptSettingsService.getSettings(user));
    }

    @Transactional
    public ReceiptResponse updateReceipt(User user, Long id, ReceiptRequest request) {
        Receipt receipt = receiptRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found"));
        applyReceiptRequest(receipt, request);
        Receipt saved = receiptRepository.save(receipt);
        return toResponse(saved, receiptSettingsService.getSettings(user));
    }

    @Transactional
    public void deleteReceipt(User user, Long id) {
        Receipt receipt = receiptRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found"));
        receiptRepository.delete(receipt);
    }

    @Transactional(readOnly = true)
    public List<ReceiptResponse> getReceipts(User user) {
        ReceiptSettingsDto settings = receiptSettingsService.getSettings(user);
        return receiptRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(receipt -> toResponse(receipt, settings))
                .toList();
    }

    @Transactional(readOnly = true)
    public ReceiptResponse getReceipt(User user, Long id) {
        Receipt receipt = receiptRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found"));
        return toResponse(receipt, receiptSettingsService.getSettings(user));
    }

    private void applyReceiptRequest(Receipt receipt, ReceiptRequest request) {
        receipt.setCustomerName(request.customerName());
        receipt.setDate(request.date());
        receipt.setPaymentMethod(request.paymentMethod());

        List<ReceiptItem> items = new ArrayList<>();
        for (var itemRequest : request.items()) {
            ReceiptItem item = new ReceiptItem();
            item.setReceipt(receipt);
            item.setItemName(itemRequest.itemName());
            item.setQuantity(itemRequest.quantity().setScale(2, RoundingMode.HALF_UP));
            item.setPrice(itemRequest.price().setScale(2, RoundingMode.HALF_UP));
            items.add(item);
        }

        receipt.getItems().clear();
        receipt.getItems().addAll(items);
        receipt.setTotal(calculateTotal(receipt.getItems()));
    }

    private BigDecimal calculateTotal(List<ReceiptItem> items) {
        return items.stream()
                .map(item -> item.getPrice().multiply(item.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private ReceiptResponse toResponse(Receipt receipt, ReceiptSettingsDto settings) {
        return new ReceiptResponse(
                receipt.getId(),
                receipt.getCustomerName(),
                receipt.getDate(),
                receipt.getPaymentMethod(),
                receipt.getTotal(),
                receipt.getCreatedAt(),
                receipt.getItems().stream().map(item -> new ReceiptItemResponse(
                        item.getId(),
                        item.getItemName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice().multiply(item.getQuantity()).setScale(2, RoundingMode.HALF_UP)
                )).toList(),
                settings
        );
    }
}
