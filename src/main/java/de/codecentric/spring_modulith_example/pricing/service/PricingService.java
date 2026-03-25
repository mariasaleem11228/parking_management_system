package de.codecentric.spring_modulith_example.pricing.service;

import de.codecentric.spring_modulith_example.pricing.entity.PricingPolicy;
import de.codecentric.spring_modulith_example.pricing.repository.PricingPolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PricingService {

    private final PricingPolicyRepository pricingPolicyRepository;

    public PricingService(PricingPolicyRepository pricingPolicyRepository) {
        this.pricingPolicyRepository = pricingPolicyRepository;
    }

    public List<PricingPolicy> getAllPricing() {
        return pricingPolicyRepository.findAll();
    }

    public PricingPolicy createPricing(PricingPolicy policy) {
        return pricingPolicyRepository.save(policy);
    }

    public PricingPolicy updatePricing(Long id, PricingPolicy updated) {
        PricingPolicy policy = pricingPolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        policy.setZoneId(updated.getZoneId());
        policy.setZoneName(updated.getZoneName());
        policy.setType(updated.getType());
        policy.setPricePerHour(updated.getPricePerHour());
        policy.setChargingFeePerKwh(updated.getChargingFeePerKwh());
        policy.setCurrency(updated.getCurrency());

        return pricingPolicyRepository.save(policy);
    }

    public void deletePricing(Long id) {
        pricingPolicyRepository.deleteById(id);
    }

    public List<PricingPolicy> getPricingByZone(Long zoneId) {
        return pricingPolicyRepository.findByZoneId(zoneId);
    }
}