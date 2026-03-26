package de.codecentric.spring_modulith_example.reservation.application.dto;

public record FinishReservationCommand(
        String reservationId
) {}