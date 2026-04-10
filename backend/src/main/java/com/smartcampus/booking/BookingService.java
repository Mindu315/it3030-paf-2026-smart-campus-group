package com.smartcampus.booking;
import com.smartcampus.notification.Notification;
import com.smartcampus.notification.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.lang.NonNull;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationRepository notificationRepository; // Inject the new repository

    public List<Booking> findAllBookings() {
    return bookingRepository.findAll();
}

    public Booking saveBooking(Booking booking) {
        if (isConflict(booking)) {
            throw new RuntimeException("Time slot already booked for " + booking.getResourceName());
        }
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    private boolean isConflict(Booking newBooking) {
        List<Booking> existing = bookingRepository.findByResourceName(newBooking.getResourceName());
        return existing.stream()
            .filter(b -> !"REJECTED".equals(b.getStatus()))
            .anyMatch(ext -> 
                newBooking.getStartTime().isBefore(ext.getEndTime()) && 
                newBooking.getEndTime().isAfter(ext.getStartTime())
            );
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus("PENDING");
    }

    public Booking updateStatus(@NonNull String id, String status) {
    // We add a check to handle the case where the ID might not exist
    Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
            
    booking.setStatus(status);
    return bookingRepository.save(booking);
}

// NEW: The Cancellation/Delete Method
    public void deleteBooking(@NonNull String id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking ID not found in database");
        }
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByStudentId(String studentId) {
        // This assumes your BookingRepository has a method findByStudentId
        return bookingRepository.findByStudentId(studentId);
    }

    public List<Booking> getBookingsByStudentIdAndStatus(String studentId, String status) {
        return bookingRepository.findByStudentIdAndStatus(studentId, status);
    }

    public void updateBookingStatus(String id, String status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

    booking.setStatus(status);
    bookingRepository.save(booking);
    // Create notifications for important status changes
    try {
        if ("REJECTED".equalsIgnoreCase(status)) {
            Notification notification = new Notification();
            notification.setBookingId(id);
            notification.setStudentId(booking.getStudentId());
            notification.setMessage(reason != null && !reason.isBlank() ? reason : "Your booking request was rejected.");
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        } else if ("APPROVED".equalsIgnoreCase(status)) {
            Notification notification = new Notification();
            notification.setBookingId(id);
            notification.setStudentId(booking.getStudentId());
            notification.setMessage("Your booking has been approved for " + booking.getResourceName());
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        } else if ("CANCELLED".equalsIgnoreCase(status)) {
            Notification notification = new Notification();
            notification.setBookingId(id);
            notification.setStudentId(booking.getStudentId());
            notification.setMessage("Your booking has been cancelled.");
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        }
    } catch (Exception ignored) {
    }
}

    
}
