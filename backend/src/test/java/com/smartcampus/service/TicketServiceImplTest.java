package com.smartcampus.service;

import com.smartcampus.dto.TicketAssignRequest;
import com.smartcampus.dto.TicketCreateRequest;
import com.smartcampus.dto.TicketStatusUpdateRequest;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.util.CurrentUser;
import com.smartcampus.util.FileStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceImplTest {
    @Mock private TicketRepository ticketRepository;
    @Mock private FileStorageService fileStorageService;
    @InjectMocks private TicketServiceImpl ticketService;

    @Test
    void createTicket_success() {
        TicketCreateRequest request = new TicketCreateRequest();
        request.setTitle("Broken Light");
        request.setDescription("Issue");
        request.setCategory("ELECTRICAL");
        request.setLocation("Block A");
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        Ticket saved = ticketService.createTicket(request, null, new CurrentUser("u1", "u@test.com", "USER"));
        assertEquals("Broken Light", saved.getTitle());
        assertEquals(TicketStatus.OPEN, saved.getStatus());
    }

    @Test
    void updateStatus_invalidTransition_throws() {
        Ticket ticket = Ticket.builder().id("t1").status(TicketStatus.OPEN).build();
        when(ticketRepository.findById("t1")).thenReturn(Optional.of(ticket));
        TicketStatusUpdateRequest request = new TicketStatusUpdateRequest();
        request.setStatus(TicketStatus.CLOSED);
        assertThrows(IllegalArgumentException.class,
                () -> ticketService.updateStatus("t1", request, new CurrentUser("a1", "a@test.com", "ADMIN")));
    }

    @Test
    void assignTechnician_success() {
        Ticket ticket = Ticket.builder().id("t1").status(TicketStatus.OPEN).build();
        when(ticketRepository.findById("t1")).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        TicketAssignRequest request = new TicketAssignRequest();
        request.setTechnicianId("tech-1");
        request.setTechnicianName("Tech User");
        Ticket updated = ticketService.assignTechnician("t1", request);
        assertEquals("tech-1", updated.getAssignedTechnicianId());
    }
}
