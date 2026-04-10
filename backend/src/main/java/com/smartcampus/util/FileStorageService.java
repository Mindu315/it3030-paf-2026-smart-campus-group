package com.smartcampus.util;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final int MAX_FILES_PER_TICKET = 3;
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of("image/jpeg", "image/png");

    public List<String> storeTicketAttachments(String ticketId, MultipartFile[] files, int existingCount) {
        if (files == null || files.length == 0) {
            return List.of();
        }
        if (existingCount + files.length > MAX_FILES_PER_TICKET) {
            throw new IllegalArgumentException("Maximum 3 attachments are allowed per ticket");
        }

        Path ticketDir = Paths.get("uploads", "tickets", ticketId);
        try {
            Files.createDirectories(ticketDir);
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : files) {
                validate(file);
                String extension = getExtension(file.getOriginalFilename());
                String filename = UUID.randomUUID() + extension;
                Path target = ticketDir.resolve(filename);
                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                urls.add("/uploads/tickets/" + ticketId + "/" + filename);
            }
            return urls;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store attachment", ex);
        }
    }

    public void deleteAttachmentByUrl(String relativeUrl) {
        if (relativeUrl == null || relativeUrl.isBlank()) return;
        Path path = Paths.get(relativeUrl.replaceFirst("^/", ""));
        try {
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to delete attachment", ex);
        }
    }

    public void deleteTicketDirectory(String ticketId) {
        Path dir = Paths.get("uploads", "tickets", ticketId);
        if (!Files.exists(dir)) return;
        try (var stream = Files.walk(dir)) {
            stream.sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
        } catch (IOException ex) {
            throw new RuntimeException("Failed to delete ticket attachments", ex);
        }
    }

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size must be less than or equal to 5MB");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Only JPEG and PNG files are allowed");
        }
    }

    private String getExtension(String originalFilename) {
        String cleaned = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        int dotIndex = cleaned.lastIndexOf(".");
        return dotIndex >= 0 ? cleaned.substring(dotIndex) : ".jpg";
    }
}
