package de.codecentric.spring_modulith_example.reservation.adapter.billing;

import de.codecentric.spring_modulith_example.reservation.domain.event.ReservationFinishedEvent;
import de.codecentric.spring_modulith_example.reservation.port.BillingPublisher;

public class FakeBillingPublisher implements BillingPublisher {

    @Override
    public void publishFinished(ReservationFinishedEvent event) {
        System.out.println("Billing triggered for: " + event.reservationId());
    }
}