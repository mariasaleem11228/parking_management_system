package de.codecentric.spring_modulith_example.reservation.repository;

import de.codecentric.spring_modulith_example.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}