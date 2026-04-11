package com.smartcampus.service;

import com.smartcampus.dto.TicketAssignRequest;
import com.smartcampus.dto.TicketCreateRequest;
import com.smartcampus.dto.TicketStatusUpdateRequest;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.notification.NotificationRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import com.smartcampus.util.CurrentUser;
import com.smartcampus.util.FileStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceImplTest {
    @Mock private TicketRepository ticketRepository;
    @Mock private FileStorageService fileStorageService;
    @Mock private UserRepository userRepository;
    @Mock private NotificationRepository notificationRepository;
    @InjectMocks private TicketServiceImpl ticketService;

    @Test
    void createTicket_success() {
        TicketCreateRequest request = new TicketCreateRequest();
        request.setTitle("Broken Light");
        request.setDescription("Issue");
        request.setCategory("ELECTRICAL");
        request.setLocation("Block A");
        when(userRepository.findFirstByRolesIn(anyList())).thenReturn(Optional.empty());
        when(fileStorageService.storeTicketAttachments(any(), isNull(), anyInt())).thenReturn(List.of());
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        Ticket saved = ticketService.createTicket(request, null, new CurrentUser("u1", "u@test.com", "USER"));
        assertEquals("Broken Light", saved.getTitle());
        assertEquals(TicketStatus.OPEN, saved.getStatus());
    }

    @Test
    void createTicket_autoAssignsFirstTechnician() {
        TicketCreateRequest request = new TicketCreateRequest();
        request.setTitle("Leak");
        request.setDescription("Water");
        request.setCategory("PLUMBING");
        request.setLocation("Lab 2");
        User tech = new User();
        tech.setId("tech-99");
        tech.setName("Pat");
        tech.setEmail("pat@example.com");
        tech.setRoles(List.of("TECHNICIAN"));
        when(userRepository.findFirstByRolesIn(anyList())).thenReturn(Optional.of(tech));
        when(fileStorageService.storeTicketAttachments(any(), isNull(), anyInt())).thenReturn(List.of());
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        Ticket saved = ticketService.createTicket(request, null, new CurrentUser("u1", "u@test.com", "USER"));
        assertEquals("tech-99", saved.getAssignedTechnicianId());
        assertEquals("Pat", saved.getAssignedTechnicianName());
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
    void updateStatus_userAndTechnicianRoles_canOpenToInProgress() {
        Ticket ticket = Ticket.builder().id("t1").status(TicketStatus.OPEN).assignedTechnicianId("tech1").build();
        when(ticketRepository.findById("t1")).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        TicketStatusUpdateRequest request = new TicketStatusUpdateRequest();
        request.setStatus(TicketStatus.IN_PROGRESS);
        CurrentUser technician = new CurrentUser("tech1", "t@test.com", List.of("USER", "TECHNICIAN"));
        Ticket updated = ticketService.updateStatus("t1", request, technician);
        assertEquals(TicketStatus.IN_PROGRESS, updated.getStatus());
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
