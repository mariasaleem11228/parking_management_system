package de.codecentric.spring_modulith_example.parking.service;

import de.codecentric.spring_modulith_example.parking.controller.ParkingDtos.SpaceRequest;
import de.codecentric.spring_modulith_example.parking.controller.ParkingDtos.SpaceResponse;
import de.codecentric.spring_modulith_example.parking.controller.ParkingDtos.ZoneRequest;
import de.codecentric.spring_modulith_example.parking.controller.ParkingDtos.ZoneResponse;
import de.codecentric.spring_modulith_example.parking.model.Space;
import de.codecentric.spring_modulith_example.parking.model.SpaceStatus;
import de.codecentric.spring_modulith_example.parking.model.Zone;
import de.codecentric.spring_modulith_example.parking.repository.SpaceRepository;
import de.codecentric.spring_modulith_example.parking.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ParkingManagementService {
    private final ZoneRepository zoneRepository;
    private final SpaceRepository spaceRepository;

    public ParkingManagementService(ZoneRepository zoneRepository, SpaceRepository spaceRepository) {
        this.zoneRepository = zoneRepository;
        this.spaceRepository = spaceRepository;
    }

    public List<ZoneResponse> getZones() {
        return zoneRepository.findAll().stream().map(ZoneResponse::from).toList();
    }

    public ZoneResponse getZone(Long id) {
        return ZoneResponse.from(findZone(id));
    }

    public ZoneResponse createZone(ZoneRequest request) {
        Zone zone = new Zone();
        applyZone(zone, request);
        return ZoneResponse.from(zoneRepository.save(zone));
    }

    public ZoneResponse updateZone(Long id, ZoneRequest request) {
        Zone zone = findZone(id);
        applyZone(zone, request);
        return ZoneResponse.from(zone);
    }

    public void deleteZone(Long id) {
        zoneRepository.delete(findZone(id));
    }

    public List<SpaceResponse> getSpaces(Long zoneId, SpaceStatus status) {
        List<Space> spaces;
        if (zoneId != null && status != null) {
            spaces = spaceRepository.findByZoneIdAndStatus(zoneId, status);
        } else if (zoneId != null) {
            spaces = spaceRepository.findByZoneId(zoneId);
        } else if (status != null) {
            spaces = spaceRepository.findByStatus(status);
        } else {
            spaces = spaceRepository.findAll();
        }
        return spaces.stream().map(SpaceResponse::from).toList();
    }

    public SpaceResponse getSpace(Long id) {
        return SpaceResponse.from(findSpace(id));
    }

    public SpaceResponse createSpace(SpaceRequest request) {
        Zone zone = findZone(request.zoneId());
        validateZoneCapacity(zone, null);
        Space space = new Space();
        applySpace(space, request, zone);
        return SpaceResponse.from(spaceRepository.save(space));
    }

    public SpaceResponse updateSpace(Long id, SpaceRequest request) {
        Space space = findSpace(id);
        Zone targetZone = findZone(request.zoneId());
        validateZoneCapacity(targetZone, space);
        applySpace(space, request, targetZone);
        return SpaceResponse.from(space);
    }

    public void deleteSpace(Long id) {
        spaceRepository.delete(findSpace(id));
    }

    private void applyZone(Zone zone, ZoneRequest request) {
        zone.setName(request.name());
        zone.setCity(request.city());
        zone.setDescription(request.description());
        zone.setLatitude(request.latitude());
        zone.setLongitude(request.longitude());
        zone.setCapacity(request.capacity());
    }

    private void applySpace(Space space, SpaceRequest request, Zone zone) {
        space.setName(request.name());
        space.setZone(zone);
        space.setStatus(request.status());
        space.setLatitude(request.latitude());
        space.setLongitude(request.longitude());
        space.setPricePerHour(request.pricePerHour());
    }

    private void validateZoneCapacity(Zone zone, Space currentSpace) {
        long existingSpaceCount = spaceRepository.findByZoneId(zone.getId()).size();
        boolean movingWithinSameZone = currentSpace != null
            && currentSpace.getZone() != null
            && currentSpace.getZone().getId().equals(zone.getId());

        if (!movingWithinSameZone && existingSpaceCount >= zone.getCapacity()) {
            throw new IllegalStateException("Zone capacity exceeded for zone id " + zone.getId());
        }
    }

    private Zone findZone(Long id) {
        return zoneRepository.findById(id).orElseThrow();
    }

    private Space findSpace(Long id) {
        return spaceRepository.findById(id).orElseThrow();
    }
}
