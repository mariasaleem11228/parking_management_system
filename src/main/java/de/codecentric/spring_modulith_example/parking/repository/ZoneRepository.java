package de.codecentric.spring_modulith_example.parking.repository;

import de.codecentric.spring_modulith_example.parking.model.Zone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
}
