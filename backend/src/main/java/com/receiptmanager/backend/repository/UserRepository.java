package com.receiptmanager.backend.repository;

import com.receiptmanager.backend.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "receiptSettings")
    Optional<User> findWithReceiptSettingsByEmail(String email);
}
