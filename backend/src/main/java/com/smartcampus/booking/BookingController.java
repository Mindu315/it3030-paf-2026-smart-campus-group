package com.smartcampus.booking;

import com.smartcampus.booking.dto.StatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // Allows your React app to talk to the backend
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/add")
    public ResponseEntity<?> create(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.saveBooking(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
        @PathVariable String id, 
        @RequestBody StatusRequest request 
    ) {
        // This passes the ID, Status, and Reason to the Service
        bookingService.updateBookingStatus(id, request.getStatus(), request.getReason());
        
        return ResponseEntity.ok("Status updated successfully and student notified");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/pending")
    public List<Booking> getPending() {
        return bookingService.getPendingBookings();
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingService.findAllBookings();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Booking>> getBookingsByStudent(@PathVariable String studentId) {
        List<Booking> studentBookings = bookingService.getBookingsByStudentId(studentId);
        return ResponseEntity.ok(studentBookings);
    }

    @GetMapping("/student/{studentId}/pending")
    public ResponseEntity<List<Booking>> getPendingBookingsForStudent(@PathVariable String studentId) {
        List<Booking> studentPendingBookings = bookingService.getBookingsByStudentIdAndStatus(studentId, "PENDING");
        return ResponseEntity.ok(studentPendingBookings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable @NonNull String id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Booking cancelled and deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
