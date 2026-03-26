package de.codecentric.spring_modulith_example.parking;

import de.codecentric.spring_modulith_example.parking.model.SpaceStatus;

import java.util.List;

public interface ParkingApi {

    List<ParkingDtos.ZoneResponse> getZones();

    ParkingDtos.ZoneResponse getZone(Long id);

    ParkingDtos.ZoneResponse createZone(ParkingDtos.ZoneRequest request);

    ParkingDtos.ZoneResponse updateZone(Long id, ParkingDtos.ZoneRequest request);

    void deleteZone(Long id);

    List<ParkingDtos.SpaceResponse> getSpaces(Long zoneId, SpaceStatus status);

    ParkingDtos.SpaceResponse getSpace(Long id);

    ParkingDtos.SpaceResponse createSpace(ParkingDtos.SpaceRequest request);

    ParkingDtos.SpaceResponse updateSpace(Long id, ParkingDtos.SpaceRequest request);

    void deleteSpace(Long id);

    String reserveSpace(String spaceName);
}