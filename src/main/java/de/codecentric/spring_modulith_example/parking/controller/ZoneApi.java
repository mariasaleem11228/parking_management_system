package de.codecentric.spring_modulith_example.parking.controller;

import de.codecentric.spring_modulith_example.parking.ParkingApi;
import de.codecentric.spring_modulith_example.parking.ParkingDtos.SpaceResponse;
import de.codecentric.spring_modulith_example.parking.ParkingDtos.ZoneRequest;
import de.codecentric.spring_modulith_example.parking.ParkingDtos.ZoneResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static de.codecentric.spring_modulith_example.parking.ParkingDtos.*;

@RestController
@RequestMapping("/api/zones")
public class ZoneApi {
    private final ParkingApi parkingApi;

public ZoneApi(ParkingApi parkingApi) {
    this.parkingApi = parkingApi;
}

    @GetMapping
    public List<ZoneResponse> getZones() {
        return parkingApi.getZones();
    }

    @GetMapping("/{id}")
    public ZoneResponse getZone(@PathVariable Long id) {
        return parkingApi.getZone(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ZoneResponse createZone(@Valid @RequestBody ZoneRequest request) {
        return parkingApi.createZone(request);
    }

    @PutMapping("/{id}")
    public ZoneResponse updateZone(@PathVariable Long id, @Valid @RequestBody ZoneRequest request) {
        return parkingApi.updateZone(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteZone(@PathVariable Long id) {
        parkingApi.deleteZone(id);
    }

    @GetMapping("/{id}/spaces")
    public List<SpaceResponse> getZoneSpaces(@PathVariable Long id) {
        return parkingApi.getSpaces(id, null);
    }
}
