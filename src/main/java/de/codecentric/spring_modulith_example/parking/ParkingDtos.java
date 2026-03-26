package de.codecentric.spring_modulith_example.parking;

import de.codecentric.spring_modulith_example.parking.model.Space;
import de.codecentric.spring_modulith_example.parking.model.SpaceStatus;
import de.codecentric.spring_modulith_example.parking.model.Zone;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class ParkingDtos {
    private ParkingDtos() {}

    public record ZoneRequest(
        @NotBlank String name,
        String city,
        String description,
        Double latitude,
        Double longitude,
        @NotNull @Min(0) Integer capacity
    ) {}

    public record ZoneResponse(
        Long id,
        String name,
        String city,
        String description,
        Double latitude,
        Double longitude,
        Integer capacity
    ) {
        public static ZoneResponse from(Zone zone) {
            return new ZoneResponse(
                zone.getId(),
                zone.getName(),
                zone.getCity(),
                zone.getDescription(),
                zone.getLatitude(),
                zone.getLongitude(),
                zone.getCapacity()
            );
        }
    }

    public record SpaceRequest(
        @NotBlank String name,
        @NotNull Long zoneId,
        @NotNull SpaceStatus status,
        Double latitude,
        Double longitude,
        @DecimalMin(value = "0.0", inclusive = true) Double pricePerHour
    ) {}

    public record SpaceResponse(
        Long id,
        String name,
        Long zoneId,
        String zoneName,
        SpaceStatus status,
        Double latitude,
        Double longitude,
        Double pricePerHour
    ) {
        public static SpaceResponse from(Space space) {
            return new SpaceResponse(
                space.getId(),
                space.getName(),
                space.getZone().getId(),
                space.getZone().getName(),
                space.getStatus(),
                space.getLatitude(),
                space.getLongitude(),
                space.getPricePerHour()
            );
        }
    }
}
