package com.smartcampus.util;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FileStorageServiceTest {
    private final FileStorageService fileStorageService = new FileStorageService();

    @Test
    void validate_fileType() {
        MockMultipartFile file = new MockMultipartFile("f", "a.txt", "text/plain", "abc".getBytes());
        assertThrows(IllegalArgumentException.class, () -> fileStorageService.validate(file));
    }

    @Test
    void validate_sizeLimit() {
        byte[] big = new byte[6 * 1024 * 1024];
        MockMultipartFile file = new MockMultipartFile("f", "a.jpg", "image/jpeg", big);
        assertThrows(IllegalArgumentException.class, () -> fileStorageService.validate(file));
    }

    @Test
    void maxThreeFiles() {
        MockMultipartFile file = new MockMultipartFile("f", "a.jpg", "image/jpeg", "ok".getBytes());
        assertThrows(IllegalArgumentException.class,
                () -> fileStorageService.storeTicketAttachments("t1", new MockMultipartFile[]{file, file}, 2));
        assertDoesNotThrow(() -> fileStorageService.storeTicketAttachments("t2", new MockMultipartFile[]{file}, 2));
    }
}
