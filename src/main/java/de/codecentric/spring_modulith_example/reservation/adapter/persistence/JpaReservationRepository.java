package de.codecentric.spring_modulith_example.reservation.adapter.persistence;

import de.codecentric.spring_modulith_example.reservation.domain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaReservationRepository extends JpaRepository<Reservation, String> {
}
