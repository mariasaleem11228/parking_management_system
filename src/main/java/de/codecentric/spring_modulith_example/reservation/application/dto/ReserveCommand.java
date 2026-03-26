package de.codecentric.spring_modulith_example.reservation.application.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReserveCommand(
        String userId,
        String spaceId,
        LocalDate date,
        LocalTime startTime,
        int durationInHours
) {}