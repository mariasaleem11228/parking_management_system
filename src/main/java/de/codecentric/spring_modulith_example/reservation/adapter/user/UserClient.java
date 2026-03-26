package de.codecentric.spring_modulith_example.reservation.adapter.user;

import de.codecentric.spring_modulith_example.reservation.port.IUserClient;
import de.codecentric.spring_modulith_example.user.TokenValidationService;
import org.springframework.stereotype.Component;

@Component
public class UserClient implements IUserClient {
    private final TokenValidationService tokenValidationService;
    private final ThreadLocal<String> currentToken = new ThreadLocal<>();

    public UserClient(TokenValidationService tokenValidationService) {
        this.tokenValidationService = tokenValidationService;
    }

    public void setToken(String token) {
        currentToken.set(token);
    }

    @Override
    public boolean isAuthenticated(String userId) {
        String token = currentToken.get();
        if (token == null) {
            return false;
        }

        // Validate token using the public API from user module
        String validatedUserId = tokenValidationService.validateTokenAndGetUserId(token);

        // Check if token is valid and matches userId
        return validatedUserId != null && validatedUserId.equals(userId);
    }
}
