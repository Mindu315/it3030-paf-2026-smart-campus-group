package com.smartcampus.booking;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")

public class Booking {

    @Id
    private String id;
    private String studentId;     // e.g., "Umi_01"
    private String studentName;   // For Admin dashboard
    private String resourceName;  // e.g., "Lab A1"
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;        // PENDING, CONFIRMED, REJECTED
    
}
