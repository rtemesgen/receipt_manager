package com.receiptmanager.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.receiptmanager.backend.dto.LoginRequest;
import com.receiptmanager.backend.dto.ReceiptItemRequest;
import com.receiptmanager.backend.dto.ReceiptRequest;
import com.receiptmanager.backend.dto.RegisterRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ReceiptManagerApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerCreatesSettingsAndReturnsToken() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Jane Shopkeeper",
                "jane@example.com",
                "password123",
                "+256700000001",
                "Plot 10 Kampala Road",
                "React Stores",
                "+256711111111",
                "Thank you for shopping with us",
                "https://example.com",
                "TIN123",
                "https://example.com/logo.png"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("jane@example.com"));
    }

    @Test
    void loginAndCreateReceiptHappyPath() throws Exception {
        String token = registerAndLogin("john@example.com");

        ReceiptRequest receiptRequest = new ReceiptRequest(
                "Customer One",
                LocalDate.now(),
                "Cash",
                List.of(
                        new ReceiptItemRequest("Rice", new BigDecimal("2"), new BigDecimal("5.50")),
                        new ReceiptItemRequest("Milk", new BigDecimal("1"), new BigDecimal("3.00"))
                )
        );

        mockMvc.perform(post("/receipts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(receiptRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(14.00))
                .andExpect(jsonPath("$.settings.businessName").value("Store Hub"));
    }

    @Test
    void updateAndDeleteReceiptWorkForCurrentUser() throws Exception {
        String token = registerAndLogin("owner@example.com");

        String createResponse = mockMvc.perform(post("/receipts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReceiptRequest(
                                "First Customer",
                                LocalDate.now(),
                                "Cash",
                                List.of(new ReceiptItemRequest("Beans", new BigDecimal("2"), new BigDecimal("2000")))
                        ))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        long receiptId = objectMapper.readTree(createResponse).get("id").asLong();

        mockMvc.perform(put("/receipts/{id}", receiptId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReceiptRequest(
                                "Mark",
                                LocalDate.now(),
                                "Mobile Money",
                                List.of(new ReceiptItemRequest("Beans", new BigDecimal("3"), new BigDecimal("2000")))
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Mark"))
                .andExpect(jsonPath("$.total").value(6000.00));

        mockMvc.perform(delete("/receipts/{id}", receiptId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/receipts/{id}", receiptId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void protectedEndpointRejectsAnonymousRequest() throws Exception {
        mockMvc.perform(get("/settings"))
                .andExpect(status().isForbidden());
    }

    private String registerAndLogin(String email) throws Exception {
        RegisterRequest register = new RegisterRequest(
                "John Manager",
                email,
                "password123",
                "+256700000002",
                "Ntinda",
                "Store Hub",
                "",
                "",
                "",
                "",
                ""
        );

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isOk());

        String loginResponse = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(email, "password123"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(loginResponse).get("token").asText();
    }
}
