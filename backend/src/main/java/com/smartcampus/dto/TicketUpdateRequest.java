package com.smartcampus.dto;

import com.smartcampus.model.enums.TicketPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketUpdateRequest {
    @NotBlank(message = "title is required")
    @Size(max = 100, message = "title must be at most 100 characters")
    private String title;

    @NotBlank(message = "description is required")
    @Size(max = 1000, message = "description must be at most 1000 characters")
    private String description;

    @NotBlank(message = "category is required")
    private String category;

    private TicketPriority priority;

    @NotBlank(message = "location is required")
    private String location;

    private String resourceId;

    @Email(message = "preferredContactEmail must be a valid email")
    private String preferredContactEmail;

    private String preferredContactPhone;
}
