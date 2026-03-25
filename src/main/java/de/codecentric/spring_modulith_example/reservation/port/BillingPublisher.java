package de.codecentric.spring_modulith_example.reservation.port;

import de.codecentric.spring_modulith_example.reservation.domain.event.ReservationFinishedEvent;

public interface BillingPublisher {

    void publishFinished(ReservationFinishedEvent event);
}