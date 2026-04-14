package com.receiptmanager.backend.controller;

import com.receiptmanager.backend.dto.ReceiptRequest;
import com.receiptmanager.backend.dto.ReceiptResponse;
import com.receiptmanager.backend.model.User;
import com.receiptmanager.backend.service.CurrentUserService;
import com.receiptmanager.backend.service.ReceiptService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;
    private final CurrentUserService currentUserService;

    public ReceiptController(ReceiptService receiptService, CurrentUserService currentUserService) {
        this.receiptService = receiptService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ReceiptResponse createReceipt(Authentication authentication, @Valid @RequestBody ReceiptRequest request) {
        User user = currentUserService.getCurrentUser(authentication);
        return receiptService.createReceipt(user, request);
    }

    @PutMapping("/{id}")
    public ReceiptResponse updateReceipt(Authentication authentication, @PathVariable Long id, @Valid @RequestBody ReceiptRequest request) {
        User user = currentUserService.getCurrentUser(authentication);
        return receiptService.updateReceipt(user, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReceipt(Authentication authentication, @PathVariable Long id) {
        User user = currentUserService.getCurrentUser(authentication);
        receiptService.deleteReceipt(user, id);
    }

    @GetMapping
    public List<ReceiptResponse> getReceipts(Authentication authentication) {
        User user = currentUserService.getCurrentUser(authentication);
        return receiptService.getReceipts(user);
    }

    @GetMapping("/{id}")
    public ReceiptResponse getReceipt(Authentication authentication, @PathVariable Long id) {
        User user = currentUserService.getCurrentUser(authentication);
        return receiptService.getReceipt(user, id);
    }
}
