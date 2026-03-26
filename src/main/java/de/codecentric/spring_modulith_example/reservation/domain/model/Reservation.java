package de.codecentric.spring_modulith_example.reservation.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "space_id", nullable = false)
    private String spaceId;

    @Column(name = "zone_id", nullable = false)
    private String zoneId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReservationStatus status;

    // JPA requires a no-arg constructor
    protected Reservation() {
    }

    public static Reservation start(
            ReservationId id,
            String userId,
            String spaceId,
            String zoneId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal totalPrice
    ) {
        Reservation reservation = new Reservation();
        reservation.id = id.getValue();
        reservation.userId = userId;
        reservation.spaceId = spaceId;
        reservation.zoneId = zoneId;
        reservation.startTime = startTime;
        reservation.endTime = endTime;
        reservation.totalPrice = totalPrice;
        reservation.status = ReservationStatus.ACTIVE;
        return reservation;
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
        return ReservationId.of(id);
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

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public ReservationStatus getStatus() {
        return status;
    }
}