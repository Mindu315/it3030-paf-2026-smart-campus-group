package com.smartcampus.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.security.jwt.JwtService;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    private static final String ADMIN_EMAIL = "admin@smart.com";
    private static final String ADMIN_PASSWORD = "Admin123@";

    private final JwtService jwtService;

    public AdminAuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required.");
        }

        if (!ADMIN_EMAIL.equalsIgnoreCase(request.email().trim()) || !ADMIN_PASSWORD.equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials.");
        }

        String id = UUID.randomUUID().toString();
        List<String> roles = List.of("ADMIN");
        String token = jwtService.generateToken(id, ADMIN_EMAIL, roles);

        AdminLoginResponse response = new AdminLoginResponse(
                id,
                "Administrator",
                ADMIN_EMAIL,
                roles,
                token);

        return ResponseEntity.ok(response);
    }
}
