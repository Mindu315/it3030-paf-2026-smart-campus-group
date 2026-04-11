package com.smartcampus.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

import com.smartcampus.security.jwt.JwtPrincipal;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Component
public class AuthUtil {
    private final HttpServletRequest request;

    public AuthUtil(HttpServletRequest request) {
        this.request = request;
    }

    public CurrentUser fromAuthentication(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof JwtPrincipal principal) {
            List<String> roles = principal.roles() == null || principal.roles().isEmpty()
                    ? List.of("USER")
                    : principal.roles().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            if (roles.isEmpty()) {
                roles = List.of("USER");
            }
            return new CurrentUser(principal.id(), principal.email(), roles);
        }

        String headerUserId = request.getHeader("X-User-Id");
        String headerEmail = request.getHeader("X-User-Email");
        String headerRole = request.getHeader("X-User-Role");
        if (headerUserId != null && !headerUserId.isBlank()) {
            List<String> roles = parseRoleHeader(headerRole);
            return new CurrentUser(
                    headerUserId,
                    headerEmail == null || headerEmail.isBlank() ? "user@smartcampus.local" : headerEmail,
                    roles
            );
        }

        if (authentication == null || !authentication.isAuthenticated()) {
            return new CurrentUser("guest-user", "guest@smartcampus.local", "USER");
        }
        String userId = authentication.getName();
        String email = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority != null && !authority.equalsIgnoreCase("ROLE_ANONYMOUS"))
                .map(authority -> {
                    String a = authority.trim();
                    if (a.toUpperCase(Locale.ROOT).startsWith("ROLE_")) {
                        return a.substring(5);
                    }
                    return a;
                })
                .filter(a -> !a.isEmpty())
                .distinct()
                .toList();
        if (roles.isEmpty()) {
            roles = List.of("USER");
        }

        if (userId == null || userId.isBlank() || "anonymousUser".equalsIgnoreCase(userId)) {
            userId = "guest-user";
            email = "guest@smartcampus.local";
        }
        return new CurrentUser(userId, email, roles);
    }

    /** Supports {@code USER,TECHNICIAN} or a single role from legacy clients. */
    private static List<String> parseRoleHeader(String headerRole) {
        if (headerRole == null || headerRole.isBlank()) {
            return List.of("USER");
        }
        List<String> roles = java.util.Arrays.stream(headerRole.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        return roles.isEmpty() ? List.of("USER") : roles;
    }
}
