package de.codecentric.spring_modulith_example.reservation.domain.exception;

public class ReservationNotFoundException extends RuntimeException {

    public ReservationNotFoundException(String reservationId) {
        super("Reservation not found: " + reservationId);
    }
}
