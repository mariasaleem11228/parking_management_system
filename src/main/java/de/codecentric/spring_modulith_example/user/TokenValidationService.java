package de.codecentric.spring_modulith_example.user;

/**
 * Public API for token validation.
 * This service is exposed to other modules.
 */
public interface TokenValidationService {
    
    /**
     * Validates a JWT token and returns the user ID if valid.
     * 
     * @param token the JWT token to validate
     * @return the user ID if valid, null otherwise
     */
    String validateTokenAndGetUserId(String token);
}
