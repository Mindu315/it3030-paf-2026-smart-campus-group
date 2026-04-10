package com.smartcampus.security.jwt;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {};

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${SMARTCAMPUS_JWT_SECRET:replace-with-long-random-secret}") String secret,
            @Value("${SMARTCAMPUS_JWT_EXP_SECONDS:86400}") long expirationSeconds
    ) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "objectMapper");
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("SMARTCAMPUS_JWT_SECRET must be set");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds <= 0 ? 86400 : expirationSeconds;
    }

    public String generateToken(String userId, String email, List<String> roles) {
        String normalizedUserId = userId == null || userId.isBlank() ? "unknown" : userId;
        String normalizedEmail = email == null || email.isBlank() ? "user@smartcampus.local" : email;
        List<String> normalizedRoles = roles == null || roles.isEmpty() ? List.of("USER") : roles;

        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = issuedAt + expirationSeconds;

        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", normalizedUserId);
        payload.put("email", normalizedEmail);
        payload.put("roles", normalizedRoles);
        payload.put("iat", issuedAt);
        payload.put("exp", expiresAt);

        try {
            String headerB64 = base64UrlEncode(objectMapper.writeValueAsBytes(header));
            String payloadB64 = base64UrlEncode(objectMapper.writeValueAsBytes(payload));
            String signingInput = headerB64 + "." + payloadB64;
            String signatureB64 = base64UrlEncode(hmacSha256(signingInput));
            return signingInput + "." + signatureB64;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate JWT", e);
        }
    }

    public Optional<JwtPrincipal> parse(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        String[] parts = token.split("\\.");
        if (parts.length != 3) return Optional.empty();

        String signingInput = parts[0] + "." + parts[1];
        String expectedSignature;
        try {
            expectedSignature = base64UrlEncode(hmacSha256(signingInput));
        } catch (Exception e) {
            return Optional.empty();
        }

        if (!constantTimeEquals(expectedSignature, parts[2])) {
            return Optional.empty();
        }

        try {
            byte[] payloadBytes = base64UrlDecode(parts[1]);
            Map<String, Object> payload = objectMapper.readValue(payloadBytes, MAP_TYPE);

            long now = Instant.now().getEpochSecond();
            Object exp = payload.get("exp");
            if (exp instanceof Number expNumber && expNumber.longValue() < now) {
                return Optional.empty();
            }

            String userId = String.valueOf(payload.getOrDefault("sub", ""));
            String email = String.valueOf(payload.getOrDefault("email", ""));
            List<String> roles = extractRoles(payload.get("roles"));
            if (roles.isEmpty()) roles = List.of("USER");

            if (userId.isBlank()) return Optional.empty();
            return Optional.of(new JwtPrincipal(userId, email, roles));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private static List<String> extractRoles(Object value) {
        if (value == null) return List.of();
        if (value instanceof List<?> list) {
            return list.stream().filter(Objects::nonNull).map(Object::toString).toList();
        }
        return List.of(value.toString());
    }

    private byte[] hmacSha256(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    private static String base64UrlEncode(byte[] bytes) {
        return BASE64_URL_ENCODER.encodeToString(bytes);
    }

    private static byte[] base64UrlDecode(String value) {
        return BASE64_URL_DECODER.decode(value);
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) return false;
        byte[] aBytes = a.getBytes(StandardCharsets.UTF_8);
        byte[] bBytes = b.getBytes(StandardCharsets.UTF_8);
        return java.security.MessageDigest.isEqual(aBytes, bBytes);
    }
}
