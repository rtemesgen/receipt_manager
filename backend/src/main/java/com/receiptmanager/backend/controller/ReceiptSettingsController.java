package com.receiptmanager.backend.controller;

import com.receiptmanager.backend.dto.ReceiptSettingsDto;
import com.receiptmanager.backend.model.User;
import com.receiptmanager.backend.service.CurrentUserService;
import com.receiptmanager.backend.service.ReceiptSettingsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/settings")
public class ReceiptSettingsController {

    private final ReceiptSettingsService receiptSettingsService;
    private final CurrentUserService currentUserService;

    public ReceiptSettingsController(ReceiptSettingsService receiptSettingsService, CurrentUserService currentUserService) {
        this.receiptSettingsService = receiptSettingsService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ReceiptSettingsDto getSettings(Authentication authentication) {
        User user = currentUserService.getCurrentUser(authentication);
        return receiptSettingsService.getSettings(user);
    }

    @PutMapping
    public ReceiptSettingsDto updateSettings(Authentication authentication, @RequestBody ReceiptSettingsDto request) {
        User user = currentUserService.getCurrentUser(authentication);
        return receiptSettingsService.updateSettings(user, request);
    }
}
