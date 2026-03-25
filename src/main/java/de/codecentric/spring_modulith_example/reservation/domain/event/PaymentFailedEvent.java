package de.codecentric.spring_modulith_example.reservation.domain.event;

public record PaymentFailedEvent(
        String reservationId,
        String reason
) {
}
