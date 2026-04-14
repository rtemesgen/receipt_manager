package com.receiptmanager.backend.repository;

import com.receiptmanager.backend.model.ReceiptSettings;
import com.receiptmanager.backend.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptSettingsRepository extends JpaRepository<ReceiptSettings, Long> {
    Optional<ReceiptSettings> findByUser(User user);
}
