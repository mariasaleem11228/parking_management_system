package de.codecentric.spring_modulith_example.reservation.domain.model;

import java.util.Objects;
import java.util.UUID;

public final class ReservationId {

    private final String value;

    private ReservationId(String value) {
        this.value = value;
    }

    public static ReservationId newId() {
        return new ReservationId(UUID.randomUUID().toString());
    }

    public static ReservationId of(String value) {
        return new ReservationId(value);
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        return this == o || (o instanceof ReservationId that && Objects.equals(value, that.value));
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}