package de.codecentric.spring_modulith_example.reservation.domain.service;

import de.codecentric.spring_modulith_example.reservation.domain.model.Reservation;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

public class PricingService {

    public BigDecimal calculate(Reservation reservation, BigDecimal hourlyRate) {
        Duration duration = Duration.between(reservation.getStartTime(), LocalDateTime.now());
        long hours = Math.max(1, duration.toHours());

        return hourlyRate.multiply(BigDecimal.valueOf(hours));
    }
}