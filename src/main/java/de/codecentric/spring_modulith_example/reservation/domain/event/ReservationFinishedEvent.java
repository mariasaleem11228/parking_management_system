package de.codecentric.spring_modulith_example.reservation.domain.event;

import java.math.BigDecimal;

public record ReservationFinishedEvent(
        String reservationId,
        BigDecimal totalPrice
) {}