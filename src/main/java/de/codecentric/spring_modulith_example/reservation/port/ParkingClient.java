package de.codecentric.spring_modulith_example.reservation.port;

import java.math.BigDecimal;

public interface ParkingClient {

    ParkingSpace getParkingSpace(String spaceId);

    LockResult lockSpace(String spaceId);

    BigDecimal getHourlyRate(String zoneId);

    void releaseSpace(String spaceId);
}