package de.codecentric.spring_modulith_example.billing.repository;

import de.codecentric.spring_modulith_example.billing.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByReservationId(Long reservationId);
}