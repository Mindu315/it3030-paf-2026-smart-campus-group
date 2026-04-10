package com.smartcampus.notification;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String bookingId;
    private String studentId;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;

    // MANUAL SETTERS (This fixes the red lines in BookingService)
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setMessage(String message) { this.message = message; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public void setRead(boolean read) { this.read = read; }

    // MANUAL GETTERS
    public String getBookingId() { return bookingId; }
    public String getStudentId() { return studentId; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public boolean isRead() { return read; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
}