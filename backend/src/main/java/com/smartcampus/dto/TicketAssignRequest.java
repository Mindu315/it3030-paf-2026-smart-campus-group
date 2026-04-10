package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketAssignRequest {
    @NotBlank(message = "technicianId is required")
    private String technicianId;
    @NotBlank(message = "technicianName is required")
    private String technicianName;
}
