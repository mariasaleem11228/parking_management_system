package de.codecentric.spring_modulith_example.reservation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reservation {

    @Id
    @GeneratedValue
    private Long id;

    private String spaceName;
    private String userId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public Reservation() {}

    public Reservation(String spaceName, String userId,
                       LocalDateTime startTime, LocalDateTime endTime) {
        this.spaceName = spaceName;
        this.userId = userId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // getters/setters
}