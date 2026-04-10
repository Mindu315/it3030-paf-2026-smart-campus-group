package com.smartcampus.security.jwt;

import java.util.List;

public record JwtPrincipal(String id, String email, List<String> roles) {}

