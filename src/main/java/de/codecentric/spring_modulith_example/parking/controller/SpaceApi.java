package de.codecentric.spring_modulith_example.parking.controller;

import de.codecentric.spring_modulith_example.parking.model.SpaceStatus;
import de.codecentric.spring_modulith_example.parking.service.ParkingManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static de.codecentric.spring_modulith_example.parking.controller.ParkingDtos.*;

@RestController
@RequestMapping("/api/spaces")
public class SpaceApi {
    private final ParkingManagementService parkingManagementService;

    public SpaceApi(ParkingManagementService parkingManagementService) {
        this.parkingManagementService = parkingManagementService;
    }

    @GetMapping
    public List<SpaceResponse> getSpaces(
        @RequestParam(required = false) Long zoneId,
        @RequestParam(required = false) SpaceStatus status
    ) {
        return parkingManagementService.getSpaces(zoneId, status);
    }

    @GetMapping("/{id}")
    public SpaceResponse getSpace(@PathVariable Long id) {
        return parkingManagementService.getSpace(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SpaceResponse createSpace(@Valid @RequestBody SpaceRequest request) {
        return parkingManagementService.createSpace(request);
    }

    @PutMapping("/{id}")
    public SpaceResponse updateSpace(@PathVariable Long id, @Valid @RequestBody SpaceRequest request) {
        return parkingManagementService.updateSpace(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSpace(@PathVariable Long id) {
        parkingManagementService.deleteSpace(id);
    }

    @GetMapping("/search")
    public List<SpaceResponse> searchSpaces(
        @RequestParam(required = false) Long zoneId,
        @RequestParam(required = false) SpaceStatus status
    ) {
        return parkingManagementService.getSpaces(zoneId, status);
    }

    @GetMapping("/available")
    public List<SpaceResponse> getAvailableSpaces() {
        return parkingManagementService.getSpaces(null, SpaceStatus.FREE);
    }
}
