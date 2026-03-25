package de.codecentric.spring_modulith_example.user.nested_modules.auth.controller;

import de.codecentric.spring_modulith_example.user.model.UserRole;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthUserResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.LoginRequest;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String STATIC_TOKEN = "dev-token-placeholder";

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        var user = new AuthUserResponse(
            1L,
            "Citizen User",
            request.email(),
            UserRole.CITIZEN.name(),
            null
        );
        return new AuthResponse(STATIC_TOKEN, user);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        var user = new AuthUserResponse(
            1L,
            request.name(),
            request.email(),
            UserRole.CITIZEN.name(),
            request.licensePlate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(STATIC_TOKEN, user));
    }

    @GetMapping("/me")
    public AuthUserResponse me() {
        return new AuthUserResponse(
            1L,
            "Citizen User",
            "citizen@example.com",
            UserRole.CITIZEN.name(),
            null
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
