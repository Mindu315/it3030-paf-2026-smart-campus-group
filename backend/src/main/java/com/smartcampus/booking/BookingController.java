package com.smartcampus.booking;

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

    @GetMapping("/pending")
    public List<Booking> getPending() {
        return bookingService.getPendingBookings();
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable @NonNull String id, @RequestParam String status) {
        return bookingService.updateStatus(id, status);
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
