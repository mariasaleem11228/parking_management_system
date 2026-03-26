package de.codecentric.spring_modulith_example.reservation.domain.event;

public record PaymentConfirmedEvent(
        String reservationId,
        String transactionId
) {
}
