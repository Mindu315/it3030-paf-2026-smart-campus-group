package com.smartcampus.config;

import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import com.smartcampus.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

/**
 * Ensures a demo technician account exists for local/demo environments and ticket auto-assign.
 * Login uses email + password (same as {@code /api/users/login}).
 */
@Component
public class DemoTechnicianUserSeed implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoTechnicianUserSeed.class);

    public static final String DEMO_TECHNICIAN_EMAIL = "technician@smartcampus.local";
    public static final String DEMO_TECHNICIAN_PASSWORD = "Technician123!";
    public static final String DEMO_TECHNICIAN_NAME = "Campus Technician";

    private final UserRepository userRepository;
    private final UserService userService;

    public DemoTechnicianUserSeed(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public void run(ApplicationArguments args) {
        Optional<User> existing = userRepository.findByEmail(DEMO_TECHNICIAN_EMAIL);
        if (existing.isEmpty()) {
            User user = new User();
            user.setName(DEMO_TECHNICIAN_NAME);
            user.setEmail(DEMO_TECHNICIAN_EMAIL);
            user.setPassword(DEMO_TECHNICIAN_PASSWORD);
            user.setRoles(List.of("USER", "TECHNICIAN"));
            userService.registerUser(user);
            log.info("Created demo technician account: {}", DEMO_TECHNICIAN_EMAIL);
            return;
        }
        User user = existing.get();
        List<String> current = Optional.ofNullable(user.getRoles()).orElseGet(List::of);
        boolean hasTechnician = current.stream()
                .filter(Objects::nonNull)
                .map(r -> r.toUpperCase(Locale.ROOT))
                .anyMatch(r -> r.equals("TECHNICIAN") || r.equals("ROLE_TECHNICIAN"));
        if (!hasTechnician) {
            ArrayList<String> merged = new ArrayList<>(current);
            merged.add("TECHNICIAN");
            userService.updateUserRoles(user.getId(), merged);
            log.info("Added TECHNICIAN role to {}", DEMO_TECHNICIAN_EMAIL);
        }
    }
}
