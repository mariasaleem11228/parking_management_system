package de.codecentric.spring_modulith_example.reservation.adapter.persistence;

import de.codecentric.spring_modulith_example.reservation.domain.model.Reservation;
import de.codecentric.spring_modulith_example.reservation.port.ReservationRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ReservationRepositoryImpl implements ReservationRepository {

    private final JpaReservationRepository jpaRepository;

    public ReservationRepositoryImpl(JpaReservationRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void save(Reservation reservation) {
        jpaRepository.save(reservation);
    }

    @Override
    public Reservation findById(String id) {
        return jpaRepository.findById(id).orElse(null);
    }
}
