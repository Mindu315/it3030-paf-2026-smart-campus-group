package com.smartcampus.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.lang.NonNull;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

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

    
}
