package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "content is required")
    @Size(max = 2000, message = "content must be at most 2000 characters")
    private String content;
}
