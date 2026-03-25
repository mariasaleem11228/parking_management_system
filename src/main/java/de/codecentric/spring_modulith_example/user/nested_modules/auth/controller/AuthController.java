package de.codecentric.spring_modulith_example.user.nested_modules.auth.controller;

import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthUserResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.LoginRequest;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.RegisterRequest;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/me")
    public AuthUserResponse me() {
        return authService.me();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return authService.logout();
    }
}
