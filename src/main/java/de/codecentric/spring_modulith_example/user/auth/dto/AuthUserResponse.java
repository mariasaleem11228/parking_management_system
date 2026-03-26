package de.codecentric.spring_modulith_example.user.auth.dto;

public record AuthUserResponse(
    Long id,
    String name,
    String email,
    String role,
    String licensePlate
) {
    private static final String FALLBACK_LICENSE_PLATE = "DO-STATIC-000";

    public AuthUserResponse {
        if (licensePlate == null || licensePlate.isBlank()) {
            licensePlate = FALLBACK_LICENSE_PLATE;
        }
    }
}
