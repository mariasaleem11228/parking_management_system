package de.codecentric.spring_modulith_example.user.service;

import de.codecentric.spring_modulith_example.user.dto.ChangeUserRoleRequest;
import de.codecentric.spring_modulith_example.user.dto.CreateUserRequest;
import de.codecentric.spring_modulith_example.user.dto.UpdateUserRequest;
import de.codecentric.spring_modulith_example.user.dto.UserResponse;
import de.codecentric.spring_modulith_example.user.model.User;
import de.codecentric.spring_modulith_example.user.model.UserRole;
import de.codecentric.spring_modulith_example.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserManagementService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toUserResponse);
    }

    public UserResponse getUserById(Long id) {
        var user = findUserById(id);
        return toUserResponse(user);
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        var role = parseRole(request.role());
        var user = new User(
            request.name(),
            request.email(),
            normalizeLicensePlate(request.licensePlate()),
            passwordEncoder.encode(request.password()),
            role
        );

        var savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        var user = findUserById(id);

        var existingByEmail = userRepository.findByEmail(request.email()).orElse(null);
        if (existingByEmail != null && !existingByEmail.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(parseRole(request.role()));
        user.setLicensePlate(normalizeLicensePlate(request.licensePlate()));

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        var savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }

    public void deleteUser(Long id) {
        var user = findUserById(id);
        userRepository.delete(user);
    }

    public UserResponse changeUserRole(Long id, ChangeUserRoleRequest request) {
        var user = findUserById(id);
        user.setRole(parseRole(request.role()));
        var savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserRole parseRole(String role) {
        try {
            return UserRole.valueOf(role.trim().toUpperCase());
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }

    private String normalizeLicensePlate(String licensePlate) {
        if (licensePlate == null || licensePlate.isBlank()) {
            return null;
        }
        return licensePlate.trim();
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getLicensePlate(),
            null
        );
    }
}