package com.smartcampus.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrentUser {
    private String userId;
    private String email;
    private String role;

    public boolean hasRole(String targetRole) {
        return role != null && (role.equalsIgnoreCase(targetRole) || role.equalsIgnoreCase("ROLE_" + targetRole));
    }
}
