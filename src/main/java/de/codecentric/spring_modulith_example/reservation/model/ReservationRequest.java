package de.codecentric.spring_modulith_example.reservation.model;

import java.time.LocalDateTime;

public record ReservationRequest(
        String spaceId,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
}