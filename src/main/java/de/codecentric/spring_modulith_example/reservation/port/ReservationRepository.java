package de.codecentric.spring_modulith_example.reservation.port;

import de.codecentric.spring_modulith_example.reservation.domain.model.Reservation;

public interface ReservationRepository {

    void save(Reservation reservation);

    Reservation findById(String id);
}