package de.codecentric.spring_modulith_example.user.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangeUserRoleRequest(
    @NotBlank String role
) {
    // NOOP
}