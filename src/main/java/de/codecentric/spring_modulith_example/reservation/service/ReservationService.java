package de.codecentric.spring_modulith_example.reservation.service;

import de.codecentric.spring_modulith_example.parking.ParkingApi;
import de.codecentric.spring_modulith_example.reservation.model.Reservation;
import de.codecentric.spring_modulith_example.reservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReservationService {

    private final ParkingApi parkingApi;
    private final ReservationRepository reservationRepository;

    public ReservationService(ParkingApi parkingApi,
                              ReservationRepository reservationRepository) {
        this.parkingApi = parkingApi;
        this.reservationRepository = reservationRepository;
    }

    public String reserve(String spaceId,
                      LocalDateTime start,
                      LocalDateTime end) {

    // call parking module
    String result = parkingApi.reserveSpace(spaceId);

    if (!result.toLowerCase().contains("reserved")) {
        throw new RuntimeException("Space not available");
    }

    Reservation reservation = new Reservation(
            spaceId,
            "test-user", // or pass from UI later
            start,
            end
    );

    reservationRepository.save(reservation);

    return "Reservation successful";
}
}