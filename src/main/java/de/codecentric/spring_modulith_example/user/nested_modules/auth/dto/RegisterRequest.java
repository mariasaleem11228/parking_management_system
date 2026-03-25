package de.codecentric.spring_modulith_example.user.nested_modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 6, max = 72) String password,
    @NotBlank String role,
    String licensePlate
) {
    // NOOP
}
