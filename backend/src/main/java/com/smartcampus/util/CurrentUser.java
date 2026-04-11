package com.smartcampus.util;

import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

/**
 * Authenticated user context. Supports multiple roles (JWT lists every role; legacy code used a single role).
 */
@Getter
@EqualsAndHashCode
public class CurrentUser {
    private final String userId;
    private final String email;
    private final List<String> roles;

    /** Backward-compatible: single role becomes a one-element list. */
    public CurrentUser(String userId, String email, String role) {
        this(userId, email, role == null || role.isBlank() ? List.of("USER") : List.of(role.trim()));
    }

    public CurrentUser(String userId, String email, List<String> roles) {
        this.userId = userId;
        this.email = email;
        if (roles == null || roles.isEmpty()) {
            this.roles = List.of("USER");
        } else {
            List<String> normalized = roles.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            this.roles = normalized.isEmpty() ? List.of("USER") : List.copyOf(normalized);
        }
    }

    /**
     * Primary role for display (e.g. comment author). Prefers TECHNICIAN / ADMIN over plain USER when both exist.
     */
    public String getRole() {
        if (hasRole("ADMIN")) {
            return roles.stream().filter(r -> matchesRole(r, "ADMIN")).findFirst().orElse("ADMIN");
        }
        if (hasRole("TECHNICIAN")) {
            return roles.stream().filter(r -> matchesRole(r, "TECHNICIAN")).findFirst().orElse("TECHNICIAN");
        }
        return roles.get(0);
    }

    public boolean hasRole(String targetRole) {
        if (targetRole == null || targetRole.isBlank()) {
            return false;
        }
        return roles.stream().anyMatch(r -> matchesRole(r, targetRole));
    }

    private static boolean matchesRole(String stored, String targetRole) {
        if (stored == null) {
            return false;
        }
        String r = stored.trim();
        String t = targetRole.trim();
        return r.equalsIgnoreCase(t)
                || r.equalsIgnoreCase("ROLE_" + t)
                || ("ROLE_" + r).equalsIgnoreCase("ROLE_" + t);
    }
}
