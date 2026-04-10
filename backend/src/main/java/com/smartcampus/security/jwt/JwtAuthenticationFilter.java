package com.smartcampus.security.jwt;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.toLowerCase(Locale.ROOT).startsWith("bearer ")) {
            String token = header.substring(7).trim();
            jwtService.parse(token).ifPresent((principal) -> {
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    Collection<? extends GrantedAuthority> authorities = toAuthorities(principal.roles());
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(principal, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            });
        }

        filterChain.doFilter(request, response);
    }

    private static List<SimpleGrantedAuthority> toAuthorities(List<String> roles) {
        if (roles == null || roles.isEmpty()) return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        return roles.stream()
                .filter((role) -> role != null && !role.isBlank())
                .map(String::trim)
                .map((role) -> role.toUpperCase(Locale.ROOT))
                .map((role) -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .distinct()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }
}

