package de.codecentric.spring_modulith_example.user.nested_modules.auth.service;

import de.codecentric.spring_modulith_example.user.model.User;
import de.codecentric.spring_modulith_example.user.model.UserRole;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.AuthUserResponse;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.LoginRequest;
import de.codecentric.spring_modulith_example.user.nested_modules.auth.dto.RegisterRequest;
import de.codecentric.spring_modulith_example.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final String STATIC_TOKEN = "dev-token-placeholder";
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return new AuthResponse(STATIC_TOKEN, toAuthUserResponse(user));
    }

    public ResponseEntity<AuthResponse> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        if (!UserRole.CITIZEN.name().equals(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be CITIZEN");
        }

        var savedUser = userRepository.save(
            new User(
                request.name(),
                request.email(),
                request.licensePlate(),
                passwordEncoder.encode(request.password()),
                UserRole.CITIZEN
            )
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new AuthResponse(STATIC_TOKEN, toAuthUserResponse(savedUser)));
    }

    public AuthUserResponse me() {
        var user = userRepository.findAll().stream().findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user context"));

        return toAuthUserResponse(user);
    }

    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }

    private AuthUserResponse toAuthUserResponse(User user) {
        return new AuthUserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getLicensePlate()
        );
    }
}
