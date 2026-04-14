package com.receiptmanager.backend.repository;

import com.receiptmanager.backend.model.Receipt;
import com.receiptmanager.backend.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    @EntityGraph(attributePaths = "items")
    List<Receipt> findByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = "items")
    Optional<Receipt> findByIdAndUser(Long id, User user);
}
