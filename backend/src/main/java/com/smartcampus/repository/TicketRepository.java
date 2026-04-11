package com.smartcampus.repository;

import com.smartcampus.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    Page<Ticket> findByReportedByUserId(String reportedByUserId, Pageable pageable);

    /** Tickets the user reported or that are assigned to them (e.g. technicians see their queue). */
    @Query("{ $or: [ { 'reportedByUserId': ?0 }, { 'assignedTechnicianId': ?0 } ] }")
    Page<Ticket> findByReportedByUserIdOrAssignedTechnicianId(String userId, Pageable pageable);
}
