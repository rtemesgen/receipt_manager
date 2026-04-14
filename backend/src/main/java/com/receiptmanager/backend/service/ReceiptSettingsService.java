package com.receiptmanager.backend.service;

import com.receiptmanager.backend.dto.ReceiptSettingsDto;
import com.receiptmanager.backend.model.ReceiptSettings;
import com.receiptmanager.backend.model.User;
import com.receiptmanager.backend.repository.ReceiptSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReceiptSettingsService {

    private final ReceiptSettingsRepository receiptSettingsRepository;

    public ReceiptSettingsService(ReceiptSettingsRepository receiptSettingsRepository) {
        this.receiptSettingsRepository = receiptSettingsRepository;
    }

    @Transactional(readOnly = true)
    public ReceiptSettingsDto getSettings(User user) {
        ReceiptSettings settings = receiptSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));
        return toDto(settings);
    }

    @Transactional
    public ReceiptSettingsDto updateSettings(User user, ReceiptSettingsDto request) {
        ReceiptSettings settings = receiptSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));
        settings.setBusinessName(request.businessName());
        settings.setAddress(request.address());
        settings.setPhone(request.phone());
        settings.setThankYouMessage(request.thankYouMessage());
        settings.setWebsite(request.website());
        settings.setTaxId(request.taxId());
        settings.setLogoUrl(request.logoUrl());
        return toDto(receiptSettingsRepository.save(settings));
    }

    private ReceiptSettings createDefaultSettings(User user) {
        ReceiptSettings settings = new ReceiptSettings();
        settings.setUser(user);
        settings.setBusinessName(user.getBusinessName());
        settings.setAddress(user.getAddress());
        settings.setPhone(user.getBusinessPhone() != null && !user.getBusinessPhone().isBlank() ? user.getBusinessPhone() : user.getPhone());
        settings.setThankYouMessage(user.getFooterMessage() != null && !user.getFooterMessage().isBlank() ? user.getFooterMessage() : "Thank you for shopping with us");
        settings.setWebsite(user.getWebsite());
        settings.setTaxId(user.getTaxId());
        settings.setLogoUrl(user.getLogoUrl());
        user.setReceiptSettings(settings);
        return receiptSettingsRepository.save(settings);
    }

    public ReceiptSettingsDto toDto(ReceiptSettings settings) {
        return new ReceiptSettingsDto(
                settings.getBusinessName(),
                settings.getAddress(),
                settings.getPhone(),
                settings.getThankYouMessage(),
                settings.getWebsite(),
                settings.getTaxId(),
                settings.getLogoUrl()
        );
    }
}
