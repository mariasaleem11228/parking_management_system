package de.codecentric.spring_modulith_example.parking.controller;

import de.codecentric.spring_modulith_example.parking.service.ParkingManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static de.codecentric.spring_modulith_example.parking.controller.ParkingDtos.*;

@RestController
@RequestMapping("/api/zones")
public class ZoneApi {
    private final ParkingManagementService parkingManagementService;

    public ZoneApi(ParkingManagementService parkingManagementService) {
        this.parkingManagementService = parkingManagementService;
    }

    @GetMapping
    public List<ZoneResponse> getZones() {
        return parkingManagementService.getZones();
    }

    @GetMapping("/{id}")
    public ZoneResponse getZone(@PathVariable Long id) {
        return parkingManagementService.getZone(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ZoneResponse createZone(@Valid @RequestBody ZoneRequest request) {
        return parkingManagementService.createZone(request);
    }

    @PutMapping("/{id}")
    public ZoneResponse updateZone(@PathVariable Long id, @Valid @RequestBody ZoneRequest request) {
        return parkingManagementService.updateZone(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteZone(@PathVariable Long id) {
        parkingManagementService.deleteZone(id);
    }

    @GetMapping("/{id}/spaces")
    public List<SpaceResponse> getZoneSpaces(@PathVariable Long id) {
        return parkingManagementService.getSpaces(id, null);
    }
}
