package com.smartcampus.booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByResourceName(String resourceName);
    List<Booking> findByStudentId(String studentId);
    List<Booking> findByStatus(String status);
}
