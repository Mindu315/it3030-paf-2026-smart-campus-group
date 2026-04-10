package com.smartcampus.dto;

import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import lombok.Data;

import java.util.List;

@Data
public class TicketResponse {
    private Ticket ticket;
    private List<Comment> comments;
}
