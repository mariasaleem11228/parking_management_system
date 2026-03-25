package de.codecentric.spring_modulith_example.reservation.port;

import java.math.BigDecimal;

public record ParkingSpace(
        String spaceId,
        String zoneId,
        BigDecimal pricePerHour,
        boolean available
) {
}
