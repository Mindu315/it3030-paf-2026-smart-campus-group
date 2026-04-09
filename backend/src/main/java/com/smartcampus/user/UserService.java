package com.smartcampus.user;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists!");
        }

        // Hash the password using BCrypt
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    //new
    
    public List<User> getAllUsers() {
        return userRepository.findAll(); // This grabs every user document from MongoDB!
    }

    public User authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Verify the password
            if (BCrypt.checkpw(password, user.getPassword())) {
                return user;
            }
        }

        throw new RuntimeException("Invalid email or password!");
    }

    public User updateUserRoles(String userId, List<String> newRoles) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        user.setRoles(newRoles);
        return userRepository.save(user);
    }

    public User authenticateGoogleUser(String idTokenString) {
        System.out.println("🔥 --- NEW GOOGLE LOGIN ATTEMPT --- 🔥");
        System.out.println("Token received from React: " + idTokenString);

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections
                            .singletonList("626989319108-aqvl0bstul726164b7mdu4uhhvvuvq2q.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    System.out.println("✅ Existing user found: " + email);
                    return userOptional.get();
                }

                // User doesn't exist, create a new one
                System.out.println("🌟 Creating brand new user: " + email);
                User newUser = User.builder()
                        .email(email)
                        .name(name)
                        .password(BCrypt.hashpw(UUID.randomUUID().toString(), BCrypt.gensalt()))
                        .roles(List.of("USER"))
                        .build();
                return userRepository.save(newUser);
            } else {
                System.out.println("❌ ID Token was verified but returned null!");
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            System.err.println("🚨 CRITICAL BACKEND ERROR DURING GOOGLE VERIFICATION 🚨");
            e.printStackTrace(); // THIS IS THE DETECTIVE LINE! It prints the exact error.
            throw new RuntimeException("Error verifying Google token", e);
        }
    }
}