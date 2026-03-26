package de.codecentric.spring_modulith_example.reservation.domain.event;

import java.math.BigDecimal;

public record PaymentRequestedEvent(
        String reservationId,
        String userId,
        BigDecimal totalPrice
) {
}
