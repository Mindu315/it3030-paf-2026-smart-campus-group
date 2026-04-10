package com.smartcampus.controller;

import com.smartcampus.model.Ticket;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.service.TicketService;
import com.smartcampus.util.AuthUtil;
import com.smartcampus.util.CurrentUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TicketController.class)
class TicketControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private TicketService ticketService;
    @MockBean private AuthUtil authUtil;

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void getAllTickets_adminOk() throws Exception {
        when(ticketService.getAllTickets(any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(new PageImpl<>(List.of(Ticket.builder().id("1").title("A").status(TicketStatus.OPEN).build())));
        mockMvc.perform(get("/api/v1/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("A"));
    }

    @Test
    @WithMockUser(roles = {"TECHNICIAN"})
    void patchStatus_ok() throws Exception {
        when(authUtil.fromAuthentication(any())).thenReturn(new CurrentUser("tech", "t@test.com", "TECHNICIAN"));
        when(ticketService.updateStatus(eq("1"), any(), any()))
                .thenReturn(Ticket.builder().id("1").status(TicketStatus.IN_PROGRESS).build());
        mockMvc.perform(patch("/api/v1/tickets/1/status")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
