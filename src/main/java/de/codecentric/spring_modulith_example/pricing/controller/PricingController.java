package de.codecentric.spring_modulith_example.pricing.controller;

import de.codecentric.spring_modulith_example.pricing.entity.PricingPolicy;
import de.codecentric.spring_modulith_example.pricing.service.PricingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping
    public List<PricingPolicy> getAllPricing() {
        return pricingService.getAllPricing();
    }

    @GetMapping("/zone/{zoneId}")
    public List<PricingPolicy> getPricingByZone(@PathVariable Long zoneId) {
        return pricingService.getPricingByZone(zoneId);
    }

    @PostMapping
    public PricingPolicy createPricing(@RequestBody PricingPolicy policy) {
        return pricingService.createPricing(policy);
    }

    @PutMapping("/{id}")
    public PricingPolicy updatePricing(@PathVariable Long id, @RequestBody PricingPolicy policy) {
        return pricingService.updatePricing(id, policy);
    }

    @DeleteMapping("/{id}")
    public void deletePricing(@PathVariable Long id) {
        pricingService.deletePricing(id);
    }
}
