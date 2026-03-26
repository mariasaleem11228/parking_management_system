package de.codecentric.spring_modulith_example.reservation.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Reservation {

    private ReservationId id;
    private String userId;
    private String spaceId;
    private String zoneId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private BigDecimal totalPrice;
    private ReservationStatus status;

    public static Reservation start(
            ReservationId id,
            String userId,
            String spaceId,
            String zoneId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal totalPrice
    ) {
        Reservation newReservation = new Reservation();
        newReservation.id = id;
        newReservation.userId = userId;
        newReservation.spaceId = spaceId;
        newReservation.zoneId = zoneId;
        newReservation.startTime = startTime;
        newReservation.endTime = endTime;
        newReservation.totalPrice = totalPrice;
        newReservation.status = ReservationStatus.ACTIVE;
        return newReservation;
    }

    public void finish() {
        this.status = ReservationStatus.FINISHED;
    }

    public void markPendingPayment() {
        this.status = ReservationStatus.PENDING_PAYMENT;
    }

    public void markCompleted() {
        this.status = ReservationStatus.COMPLETED;
    }

    public void markPaymentFailed() {
        this.status = ReservationStatus.FAILED_PAYMENT;
    }

    public String getUserId() {
        return userId;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public ReservationId getId() {
        return id;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public String getZoneId() {
        return zoneId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }
}