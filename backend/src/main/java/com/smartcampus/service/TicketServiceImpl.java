package com.smartcampus.service;

import com.smartcampus.dto.TicketAssignRequest;
import com.smartcampus.dto.TicketCreateRequest;
import com.smartcampus.dto.TicketStatusUpdateRequest;
import com.smartcampus.dto.TicketUpdateRequest;
import com.smartcampus.exception.TicketNotFoundException;
import com.smartcampus.exception.UnauthorizedActionException;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.enums.TicketPriority;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import com.smartcampus.util.CurrentUser;
import com.smartcampus.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @Override
    public Ticket createTicket(TicketCreateRequest request, MultipartFile[] attachments, CurrentUser currentUser) {
        User technician = userRepository.findFirstByRolesContaining("TECHNICIAN")
                .or(() -> userRepository.findFirstByRolesContaining("ROLE_TECHNICIAN"))
                .orElse(null);

        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .resourceId(request.getResourceId())
                .location(request.getLocation())
                .reportedByUserId(currentUser.getUserId())
                .reportedByEmail(currentUser.getEmail())
                .assignedTechnicianId(technician != null ? technician.getId() : null)
                .assignedTechnicianName(technician != null ? technician.getName() : null)
                .preferredContactEmail(request.getPreferredContactEmail())
                .preferredContactPhone(request.getPreferredContactPhone())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Ticket saved = ticketRepository.save(ticket);
        List<String> urls = fileStorageService.storeTicketAttachments(saved.getId(), attachments, 0);
        saved.getAttachmentUrls().addAll(urls);
        return ticketRepository.save(saved);
    }

    @Override
    public Page<Ticket> getAllTickets(TicketStatus status, TicketPriority priority, String category, String technicianId, int page, int size) {
        Page<Ticket> all = ticketRepository.findAll(PageRequest.of(page, size));
        List<Ticket> filtered = all.getContent().stream()
                .filter(t -> status == null || t.getStatus() == status)
                .filter(t -> priority == null || t.getPriority() == priority)
                .filter(t -> category == null || category.equalsIgnoreCase(t.getCategory()))
                .filter(t -> technicianId == null || technicianId.equals(t.getAssignedTechnicianId()))
                .toList();
        return new PageImpl<>(filtered, all.getPageable(), all.getTotalElements());
    }

    @Override
    public Page<Ticket> getMyTickets(CurrentUser currentUser, int page, int size) {
        return ticketRepository.findByReportedByUserId(currentUser.getUserId(), PageRequest.of(page, size));
    }

    @Override
    public Ticket getTicketById(String id, CurrentUser currentUser) {
        Ticket ticket = getById(id);
        if (currentUser.hasRole("ADMIN") || currentUser.hasRole("TECHNICIAN")
                || Objects.equals(ticket.getAssignedTechnicianId(), currentUser.getUserId())) {
            return ticket;
        }
        if (!Objects.equals(ticket.getReportedByUserId(), currentUser.getUserId())) {
            throw new UnauthorizedActionException("You are not allowed to view this ticket");
        }
        return ticket;
    }

    @Override
    public Ticket updateTicket(String id, TicketUpdateRequest request, CurrentUser currentUser) {
        Ticket ticket = getById(id);
        if (!Objects.equals(ticket.getReportedByUserId(), currentUser.getUserId())) {
            throw new UnauthorizedActionException("Only owner can update this ticket");
        }
        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Only OPEN tickets can be edited");
        }
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setLocation(request.getLocation());
        ticket.setResourceId(request.getResourceId());
        ticket.setPreferredContactEmail(request.getPreferredContactEmail());
        ticket.setPreferredContactPhone(request.getPreferredContactPhone());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public void deleteTicket(String id) {
        Ticket ticket = getById(id);
        ticketRepository.delete(ticket);
        fileStorageService.deleteTicketDirectory(id);
    }

    @Override
    public Ticket updateStatus(String id, TicketStatusUpdateRequest request, CurrentUser currentUser) {
        Ticket ticket = getById(id);
        validateTransition(ticket, request, currentUser);
        ticket.setStatus(request.getStatus());
        if (request.getStatus() == TicketStatus.RESOLVED) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }
        if (request.getStatus() == TicketStatus.REJECTED) {
            ticket.setRejectionReason(request.getRejectionReason());
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket assignTechnician(String id, TicketAssignRequest request) {
        Ticket ticket = getById(id);
        ticket.setAssignedTechnicianId(request.getTechnicianId());
        ticket.setAssignedTechnicianName(request.getTechnicianName());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket uploadAttachments(String id, MultipartFile[] files, CurrentUser currentUser) {
        Ticket ticket = getById(id);
        if (!Objects.equals(ticket.getReportedByUserId(), currentUser.getUserId())) {
            throw new UnauthorizedActionException("Only owner can upload attachments");
        }
        List<String> urls = fileStorageService.storeTicketAttachments(id, files, ticket.getAttachmentUrls().size());
        ticket.getAttachmentUrls().addAll(urls);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket deleteAttachment(String id, String filename, CurrentUser currentUser) {
        Ticket ticket = getById(id);
        boolean isAdmin = currentUser.hasRole("ADMIN");
        if (!isAdmin && !Objects.equals(ticket.getReportedByUserId(), currentUser.getUserId())) {
            throw new UnauthorizedActionException("Only owner or admin can delete attachments");
        }
        String target = ticket.getAttachmentUrls().stream()
                .filter(url -> url.toLowerCase(Locale.ROOT).endsWith("/" + filename.toLowerCase(Locale.ROOT)))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));
        fileStorageService.deleteAttachmentByUrl(target);
        ticket.getAttachmentUrls().remove(target);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    private Ticket getById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found: " + id));
    }

    private void validateTransition(Ticket ticket, TicketStatusUpdateRequest request, CurrentUser currentUser) {
        TicketStatus current = ticket.getStatus();
        TicketStatus next = request.getStatus();
        boolean admin = currentUser.hasRole("ADMIN");
        boolean tech = currentUser.hasRole("TECHNICIAN");
        boolean assignedUser = Objects.equals(ticket.getAssignedTechnicianId(), currentUser.getUserId());
        if (current == TicketStatus.OPEN && next == TicketStatus.IN_PROGRESS && (admin || tech || assignedUser)) return;
        if (current == TicketStatus.IN_PROGRESS && next == TicketStatus.RESOLVED && (tech || assignedUser)) {
            if (request.getResolutionNotes() == null || request.getResolutionNotes().isBlank()) {
                throw new IllegalArgumentException("resolutionNotes is required when resolving a ticket");
            }
            return;
        }
        if (current == TicketStatus.RESOLVED && next == TicketStatus.CLOSED && (admin || assignedUser)) return;
        if ((current == TicketStatus.OPEN || current == TicketStatus.IN_PROGRESS) && next == TicketStatus.REJECTED && admin) {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw new IllegalArgumentException("rejectionReason is required when rejecting a ticket");
            }
            return;
        }
        throw new IllegalArgumentException("Invalid status transition from " + current + " to " + next);
    }
}
