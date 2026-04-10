package com.smartcampus.dto;

import com.smartcampus.model.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    @NotNull(message = "status is required")
    private TicketStatus status;
    private String resolutionNotes;
    private String rejectionReason;
}
