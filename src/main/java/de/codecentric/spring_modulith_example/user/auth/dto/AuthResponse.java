package de.codecentric.spring_modulith_example.user.auth.dto;

public record AuthResponse(
    String token,
    AuthUserResponse user
) {
    // NOOP
}
