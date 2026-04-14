package com.receiptmanager.backend.service;

import com.receiptmanager.backend.dto.AuthResponse;
import com.receiptmanager.backend.dto.LoginRequest;
import com.receiptmanager.backend.dto.RegisterRequest;
import com.receiptmanager.backend.exception.BadRequestException;
import com.receiptmanager.backend.exception.UnauthorizedException;
import com.receiptmanager.backend.model.ReceiptSettings;
import com.receiptmanager.backend.model.User;
import com.receiptmanager.backend.repository.UserRepository;
import com.receiptmanager.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setBusinessName(request.businessName());
        user.setBusinessPhone(request.businessPhone());
        user.setFooterMessage(request.footerMessage());
        user.setWebsite(request.website());
        user.setTaxId(request.taxId());
        user.setLogoUrl(request.logoUrl());

        ReceiptSettings settings = new ReceiptSettings();
        settings.setBusinessName(request.businessName());
        settings.setAddress(request.address());
        settings.setPhone(request.businessPhone() != null && !request.businessPhone().isBlank() ? request.businessPhone() : request.phone());
        settings.setThankYouMessage(request.footerMessage() != null && !request.footerMessage().isBlank()
                ? request.footerMessage()
                : "Thank you for shopping with us");
        settings.setWebsite(request.website());
        settings.setTaxId(request.taxId());
        settings.setLogoUrl(request.logoUrl());
        settings.setUser(user);
        user.setReceiptSettings(settings);

        User savedUser = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(savedUser), savedUser.getEmail(), savedUser.getFullName());
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
            );
        } catch (Exception ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        return new AuthResponse(jwtService.generateToken(user), user.getEmail(), user.getFullName());
    }
}
