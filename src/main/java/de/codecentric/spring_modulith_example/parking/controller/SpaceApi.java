package de.codecentric.spring_modulith_example.parking.controller;

import de.codecentric.spring_modulith_example.parking.ParkingApi;
import de.codecentric.spring_modulith_example.parking.ParkingDtos.SpaceRequest;
import de.codecentric.spring_modulith_example.parking.ParkingDtos.SpaceResponse;
import de.codecentric.spring_modulith_example.parking.model.SpaceStatus;
import de.codecentric.spring_modulith_example.parking.service.ParkingManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static de.codecentric.spring_modulith_example.parking.ParkingDtos.*;

@RestController
@RequestMapping("/api/spaces")
public class SpaceApi {
    private final ParkingApi parkingApi;

    public SpaceApi(ParkingApi parkingApi) {
        this.parkingApi = parkingApi;
    }

    @GetMapping
    public List<SpaceResponse> getSpaces(
        @RequestParam(required = false) Long zoneId,
        @RequestParam(required = false) SpaceStatus status
    ) {
        return parkingApi.getSpaces(zoneId, status);
    }

    @GetMapping("/{id}")
    public SpaceResponse getSpace(@PathVariable Long id) {
        return parkingApi.getSpace(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SpaceResponse createSpace(@Valid @RequestBody SpaceRequest request) {
        return parkingApi.createSpace(request);
    }

    @PutMapping("/{id}")
    public SpaceResponse updateSpace(@PathVariable Long id, @Valid @RequestBody SpaceRequest request) {
        return parkingApi.updateSpace(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSpace(@PathVariable Long id) {
        parkingApi.deleteSpace(id);
    }

    @GetMapping("/search")
    public List<SpaceResponse> searchSpaces(
        @RequestParam(required = false) Long zoneId,
        @RequestParam(required = false) SpaceStatus status
    ) {
        return parkingApi.getSpaces(zoneId, status);
    }

    @GetMapping("/available")
    public List<SpaceResponse> getAvailableSpaces() {
        return parkingApi.getSpaces(null, SpaceStatus.FREE);
    }
    @PostMapping("/reserve")
public ResponseEntity<String> reserveSpace(@RequestParam String name) {
    String response = parkingApi.reserveSpace(name);
    return ResponseEntity.ok(response);
}
}
