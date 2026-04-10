package com.smartcampus.service;

import com.smartcampus.dto.TicketAssignRequest;
import com.smartcampus.dto.TicketCreateRequest;
import com.smartcampus.dto.TicketStatusUpdateRequest;
import com.smartcampus.dto.TicketUpdateRequest;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.enums.TicketPriority;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.util.CurrentUser;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {
    Ticket createTicket(TicketCreateRequest request, MultipartFile[] attachments, CurrentUser currentUser);

    Page<Ticket> getAllTickets(TicketStatus status, TicketPriority priority, String category, String technicianId, int page, int size);

    Page<Ticket> getMyTickets(CurrentUser currentUser, int page, int size);

    Ticket getTicketById(String id, CurrentUser currentUser);

    Ticket updateTicket(String id, TicketUpdateRequest request, CurrentUser currentUser);

    void deleteTicket(String id);

    Ticket updateStatus(String id, TicketStatusUpdateRequest request, CurrentUser currentUser);

    Ticket assignTechnician(String id, TicketAssignRequest request);

    Ticket uploadAttachments(String id, MultipartFile[] files, CurrentUser currentUser);

    Ticket deleteAttachment(String id, String filename, CurrentUser currentUser);
}
