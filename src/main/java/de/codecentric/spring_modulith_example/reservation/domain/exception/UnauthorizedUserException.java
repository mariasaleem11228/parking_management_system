package de.codecentric.spring_modulith_example.reservation.domain.exception;

public class UnauthorizedUserException extends RuntimeException {

    public UnauthorizedUserException(String userId) {
        super("User is not authenticated: " + userId);
    }
}
