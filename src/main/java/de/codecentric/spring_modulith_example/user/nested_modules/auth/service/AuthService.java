package de.codecentric.spring_modulith_example.user.nested_modules.auth.service;

import de.codecentric.spring_modulith_example.user.model.UserRole;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthUserResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.LoginRequest;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final String STATIC_TOKEN = "dev-token-placeholder";

    public AuthResponse login(LoginRequest request) {
        var user = new AuthUserResponse(
            1L,
            "Citizen User",
            request.email(),
            UserRole.CITIZEN.name(),
            null
        );
        return new AuthResponse(STATIC_TOKEN, user);
    }

    public ResponseEntity<AuthResponse> register(RegisterRequest request) {
        var user = new AuthUserResponse(
            1L,
            request.name(),
            request.email(),
            UserRole.CITIZEN.name(),
            request.licensePlate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(STATIC_TOKEN, user));
    }

    public AuthUserResponse me() {
        return new AuthUserResponse(
            1L,
            "Citizen User",
            "citizen@example.com",
            UserRole.CITIZEN.name(),
            null
        );
    }

    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
