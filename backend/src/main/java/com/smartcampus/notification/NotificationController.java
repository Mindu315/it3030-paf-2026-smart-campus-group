package com.smartcampus.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // Allows React to connect
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

   @GetMapping("/student/{studentId}")
    public List<Notification> getNotifications(@PathVariable String studentId) {
        // Matches the updated repository method name
        return notificationRepository.findByStudentIdOrderByTimestampDesc(studentId);
    }

    @GetMapping("/unread-count/{studentId}")
    public long getUnreadCount(@PathVariable String studentId) {
        // Matches the updated repository method name
        return notificationRepository.countByStudentIdAndReadFalse(studentId);
    }

    @PutMapping("/read/{id}")
public void markAsRead(@PathVariable String id) {
    Notification note = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
    note.setRead(true); // Changes 'read' from false to true in MongoDB
    notificationRepository.save(note);
}
}