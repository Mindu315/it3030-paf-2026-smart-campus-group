package com.smartcampus.notification;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    // Matches 'studentId' and 'timestamp' fields
    List<Notification> findByStudentIdOrderByTimestampDesc(String studentId);
    
    // Matches 'studentId' and 'read' fields
    long countByStudentIdAndReadFalse(String studentId);
    
    // Recent notifications across all students (for admin dashboard)
    List<Notification> findTop10ByOrderByTimestampDesc();
}