package com.smartcampus.controller;

import com.smartcampus.dto.CommentRequest;
import com.smartcampus.model.Comment;
import com.smartcampus.service.CommentService;
import com.smartcampus.util.AuthUtil;
import com.smartcampus.util.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(ticketId, request, user));
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId, Authentication authentication) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(commentService.getComments(ticketId, user));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        return ResponseEntity.ok(commentService.editComment(ticketId, commentId, request, user));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            Authentication authentication
    ) {
        CurrentUser user = authUtil.fromAuthentication(authentication);
        commentService.deleteComment(ticketId, commentId, user);
        return ResponseEntity.noContent().build();
    }
}
