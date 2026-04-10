package com.smartcampus.admin;

import java.util.List;

public record AdminLoginResponse(String id, String name, String email, List<String> roles) {}

