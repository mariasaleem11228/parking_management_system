package de.codecentric.spring_modulith_example.reservation.adapter.parking;

import de.codecentric.spring_modulith_example.reservation.port.LockResult;
import de.codecentric.spring_modulith_example.reservation.port.ParkingClient;
import de.codecentric.spring_modulith_example.reservation.port.ParkingSpace;

import java.math.BigDecimal;

public class FakeParkingClient implements ParkingClient {

    @Override
    public ParkingSpace getParkingSpace(String spaceId) {
        // Mock response simulating GET /api/spaces/{spaceId}
        return new ParkingSpace(
                spaceId,
                "ZONE_A",
                BigDecimal.valueOf(2.5),
                true
        );
    }

    @Override
    public LockResult lockSpace(String spaceId) {
        return new LockResult(true, "ZONE_A");
    }

    @Override
    public BigDecimal getHourlyRate(String zoneId) {
        return BigDecimal.valueOf(2.5);
    }

    @Override
    public void releaseSpace(String spaceId) {
        System.out.println("Released space: " + spaceId);
    }
}