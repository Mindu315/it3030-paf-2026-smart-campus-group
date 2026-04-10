package com.smartcampus.service;

import com.smartcampus.dto.CommentRequest;
import com.smartcampus.exception.TicketNotFoundException;
import com.smartcampus.exception.UnauthorizedActionException;
import com.smartcampus.model.Comment;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.util.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;

    @Override
    public Comment addComment(String ticketId, CommentRequest request, CurrentUser currentUser) {
        ensureTicketExists(ticketId);
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .authorId(currentUser.getUserId())
                .authorEmail(currentUser.getEmail())
                .authorRole(currentUser.getRole())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .edited(false)
                .build();
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getComments(String ticketId, CurrentUser currentUser) {
        ensureTicketExists(ticketId);
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    @Override
    public Comment editComment(String ticketId, String commentId, CommentRequest request, CurrentUser currentUser) {
        ensureTicketExists(ticketId);
        Comment comment = getComment(commentId);
        if (!Objects.equals(comment.getTicketId(), ticketId)) {
            throw new IllegalArgumentException("Comment does not belong to the ticket");
        }
        if (!Objects.equals(comment.getAuthorId(), currentUser.getUserId())) {
            throw new UnauthorizedActionException("Only author can edit the comment");
        }
        comment.setContent(request.getContent());
        comment.setEdited(true);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(String ticketId, String commentId, CurrentUser currentUser) {
        ensureTicketExists(ticketId);
        Comment comment = getComment(commentId);
        if (!Objects.equals(comment.getTicketId(), ticketId)) {
            throw new IllegalArgumentException("Comment does not belong to the ticket");
        }
        boolean isOwner = Objects.equals(comment.getAuthorId(), currentUser.getUserId());
        boolean isAdmin = currentUser.hasRole("ADMIN");
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("Only author or admin can delete comment");
        }
        commentRepository.deleteById(commentId);
    }

    private void ensureTicketExists(String ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new TicketNotFoundException("Ticket not found: " + ticketId);
        }
    }

    private Comment getComment(String commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + commentId));
    }
}
