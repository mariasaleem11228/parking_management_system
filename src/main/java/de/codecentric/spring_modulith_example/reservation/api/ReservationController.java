package de.codecentric.spring_modulith_example.reservation.api;

import de.codecentric.spring_modulith_example.reservation.adapter.user.UserClient;
import de.codecentric.spring_modulith_example.reservation.application.ReservationService;
import de.codecentric.spring_modulith_example.reservation.application.dto.FinishReservationCommand;
import de.codecentric.spring_modulith_example.reservation.application.dto.ReserveCommand;
import de.codecentric.spring_modulith_example.reservation.domain.exception.ReservationNotFoundException;
import de.codecentric.spring_modulith_example.reservation.domain.exception.SpaceNotAvailableException;
import de.codecentric.spring_modulith_example.reservation.domain.exception.UnauthorizedUserException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    private final ReservationService service;
    private final UserClient userClient;

    public ReservationController(ReservationService service, UserClient userClient) {
        this.service = service;
        this.userClient = userClient;
    }

    @PostMapping("/new")
    public ResponseEntity<Map<String, String>> reserve(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ReserveCommand cmd) {

        // Extract JWT from "Bearer <token>"
        String token = authHeader.replace("Bearer ", "");
        userClient.setToken(token);

        String reservationId = service.reserve(cmd).getValue();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("reservationId", reservationId));
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<Map<String, String>> finish(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {

        String token = authHeader.replace("Bearer ", "");
        userClient.setToken(token);

        service.finish(new FinishReservationCommand(id));
        return ResponseEntity.ok(Map.of("message", "Reservation finished, payment pending"));
    }

    @ExceptionHandler(UnauthorizedUserException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorizedUser(UnauthorizedUserException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(SpaceNotAvailableException.class)
    public ResponseEntity<Map<String, String>> handleSpaceNotAvailable(SpaceNotAvailableException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleReservationNotFound(ReservationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}