package de.codecentric.spring_modulith_example.user.nested_modules.auth.dto;

public record AuthResponse(
    String token,
    AuthUserResponse user
) {
    // NOOP
}
