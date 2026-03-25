package de.codecentric.spring_modulith_example.reservation.domain.exception;

public class SpaceNotAvailableException extends RuntimeException {

    public SpaceNotAvailableException(String spaceId) {
        super("Parking space is not available: " + spaceId);
    }
}
