package com.smartcampus.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class AuthUtil {
    private final HttpServletRequest request;

    public AuthUtil(HttpServletRequest request) {
        this.request = request;
    }

    public CurrentUser fromAuthentication(Authentication authentication) {
        String headerUserId = request.getHeader("X-User-Id");
        String headerEmail = request.getHeader("X-User-Email");
        String headerRole = request.getHeader("X-User-Role");
        if (headerUserId != null && !headerUserId.isBlank()) {
            return new CurrentUser(
                    headerUserId,
                    headerEmail == null || headerEmail.isBlank() ? "user@smartcampus.local" : headerEmail,
                    headerRole == null || headerRole.isBlank() ? "USER" : headerRole
            );
        }

        if (authentication == null || !authentication.isAuthenticated()) {
            return new CurrentUser("guest-user", "guest@smartcampus.local", "USER");
        }
        String userId = authentication.getName();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> !authority.equalsIgnoreCase("ROLE_ANONYMOUS"))
                .findFirst()
                .orElse("USER");

        if (userId == null || userId.isBlank() || "anonymousUser".equalsIgnoreCase(userId)) {
            userId = "guest-user";
            email = "guest@smartcampus.local";
        }
        return new CurrentUser(userId, email, role);
    }
}
