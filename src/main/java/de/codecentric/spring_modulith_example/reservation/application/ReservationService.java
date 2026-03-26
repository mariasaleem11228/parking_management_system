package de.codecentric.spring_modulith_example.reservation.application;

import de.codecentric.spring_modulith_example.reservation.application.dto.FinishReservationCommand;
import de.codecentric.spring_modulith_example.reservation.application.dto.ReserveCommand;
import de.codecentric.spring_modulith_example.reservation.domain.event.PaymentConfirmedEvent;
import de.codecentric.spring_modulith_example.reservation.domain.event.PaymentFailedEvent;
import de.codecentric.spring_modulith_example.reservation.domain.event.PaymentRequestedEvent;
import de.codecentric.spring_modulith_example.reservation.domain.event.ReservationFinishedEvent;
import de.codecentric.spring_modulith_example.reservation.domain.exception.ReservationNotFoundException;
import de.codecentric.spring_modulith_example.reservation.domain.exception.SpaceNotAvailableException;
import de.codecentric.spring_modulith_example.reservation.domain.exception.UnauthorizedUserException;
import de.codecentric.spring_modulith_example.reservation.domain.model.Reservation;
import de.codecentric.spring_modulith_example.reservation.domain.model.ReservationId;
import de.codecentric.spring_modulith_example.reservation.domain.service.PricingService;
import de.codecentric.spring_modulith_example.reservation.port.BillingPublisher;
import de.codecentric.spring_modulith_example.reservation.port.IUserClient;
import de.codecentric.spring_modulith_example.reservation.port.ParkingClient;
import de.codecentric.spring_modulith_example.reservation.port.ReservationRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ReservationService {

    private final IUserClient userClient;
    private final ParkingClient parkingClient;
    private final ReservationRepository repository;
    private final PricingService pricingService;
    private final BillingPublisher billingPublisher;
    private final ApplicationEventPublisher eventPublisher;

    public ReservationService(
            IUserClient userClient,
            ParkingClient parkingClient,
            ReservationRepository repository,
            PricingService pricingService,
            BillingPublisher billingPublisher,
            ApplicationEventPublisher eventPublisher
    ) {
        this.userClient = userClient;
        this.parkingClient = parkingClient;
        this.repository = repository;
        this.pricingService = pricingService;
        this.billingPublisher = billingPublisher;
        this.eventPublisher = eventPublisher;
    }

    public ReservationId reserve(ReserveCommand cmd) {
        // Step 1: Validate user authentication
        if (!userClient.isAuthenticated(cmd.userId())) {
            throw new UnauthorizedUserException(cmd.userId());
        }

        // Step 2: Get parking space details (includes pricePerHour)
        var parkingSpace = parkingClient.getParkingSpace(cmd.spaceId());

        // Step 3: Lock parking space (validates availability)
        var lockResult = parkingClient.lockSpace(cmd.spaceId());

        if (!lockResult.success()) {
            throw new SpaceNotAvailableException(cmd.spaceId());
        }

        // Step 4: Calculate start and end times
        var startDateTime = cmd.date().atTime(cmd.startTime());
        var endDateTime = startDateTime.plusHours(cmd.durationInHours());

        // Step 5: Calculate total price upfront
        BigDecimal totalPrice = parkingSpace.pricePerHour()
                .multiply(BigDecimal.valueOf(cmd.durationInHours()));

        // Step 6: Create and save reservation with all details
        var reservation = Reservation.start(
                ReservationId.newId(),
                cmd.userId(),
                cmd.spaceId(),
                lockResult.zoneId(),
                startDateTime,
                endDateTime,
                totalPrice
        );

        repository.save(reservation);
        return reservation.getId();
    }

    public void finish(FinishReservationCommand cmd) {
        var reservation = repository.findById(cmd.reservationId());
        if (reservation == null) {
            throw new ReservationNotFoundException(cmd.reservationId());
        }

        // Mark reservation as finished (price already calculated at reservation time)
        reservation.finish();

        // Move to PENDING_PAYMENT status
        reservation.markPendingPayment();
        repository.save(reservation);

        // Publish payment request event to billing module with pre-calculated price
        eventPublisher.publishEvent(
                new PaymentRequestedEvent(
                        reservation.getId().getValue(),
                        reservation.getUserId(),
                        reservation.getTotalPrice()
                )
        );
    }

    @ApplicationModuleListener
    public void onPaymentConfirmed(PaymentConfirmedEvent event) {
        var reservation = repository.findById(event.reservationId());
        if (reservation == null) {
            throw new ReservationNotFoundException(event.reservationId());
        }

        // Mark reservation as completed
        reservation.markCompleted();
        repository.save(reservation);

        // Release parking space
        parkingClient.releaseSpace(reservation.getSpaceId());
    }

    @ApplicationModuleListener
    public void onPaymentFailed(PaymentFailedEvent event) {
        var reservation = repository.findById(event.reservationId());
        if (reservation == null) {
            throw new ReservationNotFoundException(event.reservationId());
        }

        // Mark reservation as payment failed
        reservation.markPaymentFailed();
        repository.save(reservation);

        // Note: Space remains locked - business decision needed on how to handle this
        // For now, we keep the reservation in FAILED_PAYMENT status
    }
}