package de.codecentric.spring_modulith_example.pricing.repository;

import de.codecentric.spring_modulith_example.pricing.entity.PricingPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PricingPolicyRepository extends JpaRepository<PricingPolicy, Long> {
    List<PricingPolicy> findByZoneId(Long zoneId);
}