package com.smartcampus.repository;

import com.smartcampus.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    Page<Ticket> findByReportedByUserId(String reportedByUserId, Pageable pageable);
}
