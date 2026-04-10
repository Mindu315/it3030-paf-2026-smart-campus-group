package com.smartcampus.controller;

import com.smartcampus.dto.TicketAssignRequest;
import com.smartcampus.dto.TicketCreateRequest;
import com.smartcampus.dto.TicketStatusUpdateRequest;
import com.smartcampus.dto.TicketUpdateRequest;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.enums.TicketPriority;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.service.TicketService;
import com.smartcampus.util.AuthUtil;
import com.smartcampus.util.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;
    private final AuthUtil authUtil;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Ticket> createTicket(
            @Valid @ModelAttribute TicketCreateRequest request,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(request, attachments, user));
    }

    @GetMapping
    public ResponseEntity<Page<Ticket>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String technicianId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ticketService.getAllTickets(status, priority, category, technicianId, page, size));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<Ticket>> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(ticketService.getMyTickets(user, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getById(@PathVariable String id, Authentication authentication) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(ticketService.getTicketById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> update(
            @PathVariable String id,
            @Valid @RequestBody TicketUpdateRequest request,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(ticketService.updateTicket(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody TicketStatusUpdateRequest request,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(ticketService.updateStatus(id, request, user));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody TicketAssignRequest request
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, request));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<Ticket> uploadAttachments(
            @PathVariable String id,
            @RequestParam("attachments") MultipartFile[] attachments,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(ticketService.uploadAttachments(id, attachments, user));
    }

    @DeleteMapping("/{id}/attachments/{filename}")
    public ResponseEntity<Ticket> deleteAttachment(
            @PathVariable String id,
            @PathVariable String filename,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(ticketService.deleteAttachment(id, filename, user));
    }
}
