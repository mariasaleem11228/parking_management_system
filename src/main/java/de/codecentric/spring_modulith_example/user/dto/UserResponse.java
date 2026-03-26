package de.codecentric.spring_modulith_example.user.dto;

public record UserResponse(
    Long id,
    String name,
    String email,
    String role,
    String licensePlate,
    String createdAt
) {
    // NOOP
}