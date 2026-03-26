package de.codecentric.spring_modulith_example.user.auth.service;

import de.codecentric.spring_modulith_example.user.TokenValidationService;
import de.codecentric.spring_modulith_example.user.auth.jwt.JwtService;
import de.codecentric.spring_modulith_example.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationServiceImpl implements TokenValidationService {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public TokenValidationServiceImpl(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public String validateTokenAndGetUserId(String token) {
        try {
            String email = jwtService.extractEmail(token);
            var user = userRepository.findByEmail(email).orElse(null);

            if (user == null || !jwtService.isTokenValid(token, email)) {
                return null;
            }

            return user.getId().toString();
        } catch (Exception e) {
            return null;
        }
    }
}
