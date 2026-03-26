package de.codecentric.spring_modulith_example.reservation.web;

import de.codecentric.spring_modulith_example.reservation.model.ReservationRequest;
import de.codecentric.spring_modulith_example.reservation.service.ReservationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public String reserve(@RequestBody ReservationRequest request) {

        return service.reserve(
        request.spaceId(),
        request.startTime(),
        request.endTime()
);
    }
}