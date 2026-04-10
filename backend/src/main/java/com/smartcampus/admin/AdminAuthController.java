package com.smartcampus.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    private static final String ADMIN_EMAIL = "admin@smart.com";
    private static final String ADMIN_PASSWORD = "Admin123@";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required.");
        }

        if (!ADMIN_EMAIL.equalsIgnoreCase(request.email().trim()) || !ADMIN_PASSWORD.equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials.");
        }

        AdminLoginResponse response = new AdminLoginResponse(
                UUID.randomUUID().toString(),
                "Administrator",
                ADMIN_EMAIL,
                List.of("ADMIN"));

        return ResponseEntity.ok(response);
    }
}

