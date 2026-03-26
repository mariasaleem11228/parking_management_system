package de.codecentric.spring_modulith_example.parking.repository;

import de.codecentric.spring_modulith_example.parking.model.Space;
import de.codecentric.spring_modulith_example.parking.model.SpaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpaceRepository extends JpaRepository<Space, Long> {
    List<Space> findByZoneId(Long zoneId);
    List<Space> findByStatus(SpaceStatus status);
    List<Space> findByZoneIdAndStatus(Long zoneId, SpaceStatus status);
    Optional<Space> findByName(String name);
}
