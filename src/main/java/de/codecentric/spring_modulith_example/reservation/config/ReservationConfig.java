package de.codecentric.spring_modulith_example.reservation.config;

import de.codecentric.spring_modulith_example.reservation.adapter.billing.FakeBillingPublisher;
import de.codecentric.spring_modulith_example.reservation.adapter.parking.FakeParkingClient;
import de.codecentric.spring_modulith_example.reservation.domain.service.PricingService;
import de.codecentric.spring_modulith_example.reservation.port.BillingPublisher;
import de.codecentric.spring_modulith_example.reservation.port.ParkingClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReservationConfig {

    @Bean
    public ParkingClient parkingClient() {
        return new FakeParkingClient();
    }

    @Bean
    public BillingPublisher billingPublisher() {
        return new FakeBillingPublisher();
    }

    @Bean
    public PricingService pricingService() {
        return new PricingService();
    }
}