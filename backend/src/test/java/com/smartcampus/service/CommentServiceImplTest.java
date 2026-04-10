package com.smartcampus.service;

import com.smartcampus.dto.CommentRequest;
import com.smartcampus.model.Comment;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.util.CurrentUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {
    @Mock private CommentRepository commentRepository;
    @Mock private TicketRepository ticketRepository;
    @InjectMocks private CommentServiceImpl commentService;

    @Test
    void addComment_success() {
        when(ticketRepository.existsById("t1")).thenReturn(true);
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));
        CommentRequest req = new CommentRequest();
        req.setContent("Checking issue");
        Comment saved = commentService.addComment("t1", req, new CurrentUser("u1", "u@test.com", "USER"));
        assertEquals("Checking issue", saved.getContent());
    }

    @Test
    void editComment_ownerOnly() {
        when(ticketRepository.existsById("t1")).thenReturn(true);
        Comment comment = Comment.builder().id("c1").ticketId("t1").authorId("u1").build();
        when(commentRepository.findById("c1")).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));
        CommentRequest req = new CommentRequest();
        req.setContent("Edited");
        Comment edited = commentService.editComment("t1", "c1", req, new CurrentUser("u1", "u@test.com", "USER"));
        assertEquals("Edited", edited.getContent());
    }

    @Test
    void deleteComment_ownerOrAdmin() {
        when(ticketRepository.existsById("t1")).thenReturn(true);
        Comment comment = Comment.builder().id("c1").ticketId("t1").authorId("u1").build();
        when(commentRepository.findById("c1")).thenReturn(Optional.of(comment));
        assertDoesNotThrow(() -> commentService.deleteComment("t1", "c1", new CurrentUser("admin", "a@test.com", "ADMIN")));
    }
}
