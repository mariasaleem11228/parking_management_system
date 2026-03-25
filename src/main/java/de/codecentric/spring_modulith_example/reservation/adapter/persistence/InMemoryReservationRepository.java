package de.codecentric.spring_modulith_example.reservation.adapter.persistence;

import de.codecentric.spring_modulith_example.reservation.domain.model.Reservation;
import de.codecentric.spring_modulith_example.reservation.port.ReservationRepository;

import java.util.HashMap;
import java.util.Map;

public class InMemoryReservationRepository implements ReservationRepository {

    private final Map<String, Reservation> db = new HashMap<>();

    @Override
    public void save(Reservation reservation) {
        db.put(reservation.getId().toString(), reservation);
    }

    @Override
    public Reservation findById(String id) {
        return db.get(id);
    }
}