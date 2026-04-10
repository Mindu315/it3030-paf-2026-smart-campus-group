package com.smartcampus.service;

import com.smartcampus.dto.CommentRequest;
import com.smartcampus.model.Comment;
import com.smartcampus.util.CurrentUser;

import java.util.List;

public interface CommentService {
    Comment addComment(String ticketId, CommentRequest request, CurrentUser currentUser);
    List<Comment> getComments(String ticketId, CurrentUser currentUser);
    Comment editComment(String ticketId, String commentId, CommentRequest request, CurrentUser currentUser);
    void deleteComment(String ticketId, String commentId, CurrentUser currentUser);
}
