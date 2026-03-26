package de.codecentric.spring_modulith_example.reservation.config;

import de.codecentric.spring_modulith_example.reservation.adapter.billing.FakeBillingPublisher;
import de.codecentric.spring_modulith_example.reservation.adapter.parking.FakeParkingClient;
import de.codecentric.spring_modulith_example.reservation.adapter.persistence.InMemoryReservationRepository;
import de.codecentric.spring_modulith_example.reservation.adapter.user.FakeUserClient;
import de.codecentric.spring_modulith_example.reservation.domain.service.PricingService;
import de.codecentric.spring_modulith_example.reservation.port.BillingPublisher;
import de.codecentric.spring_modulith_example.reservation.port.ParkingClient;
import de.codecentric.spring_modulith_example.reservation.port.ReservationRepository;
import de.codecentric.spring_modulith_example.reservation.port.UserClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReservationConfig {

    @Bean
    public UserClient userClient() {
        return new FakeUserClient();
    }

    @Bean
    public ParkingClient parkingClient() {
        return new FakeParkingClient();
    }

    @Bean
    public BillingPublisher billingPublisher() {
        return new FakeBillingPublisher();
    }

    @Bean
    public ReservationRepository reservationRepository() {
        return new InMemoryReservationRepository();
    }

    @Bean
    public PricingService pricingService() {
        return new PricingService();
    }
}