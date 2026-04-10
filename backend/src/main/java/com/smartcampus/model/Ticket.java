package com.smartcampus.model;

import com.smartcampus.model.enums.TicketPriority;
import com.smartcampus.model.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String title;
    private String description;
    private String category;
    private TicketPriority priority;
    private TicketStatus status;
    private String resourceId;
    private String location;
    private String reportedByUserId;
    private String reportedByEmail;
    private String assignedTechnicianId;
    private String assignedTechnicianName;
    private String preferredContactEmail;
    private String preferredContactPhone;
    @Builder.Default
    private List<String> attachmentUrls = new ArrayList<>();
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
