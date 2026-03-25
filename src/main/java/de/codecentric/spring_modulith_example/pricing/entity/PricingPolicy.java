package de.codecentric.spring_modulith_example.pricing.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PricingPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long zoneId;
    private String zoneName;
    private String type;
    private Double pricePerHour;
    private Double chargingFeePerKwh;
    private String currency;

    public PricingPolicy() {
    }

    public PricingPolicy(Long id, Long zoneId, String zoneName, String type,
                         Double pricePerHour, Double chargingFeePerKwh, String currency) {
        this.id = id;
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.type = type;
        this.pricePerHour = pricePerHour;
        this.chargingFeePerKwh = chargingFeePerKwh;
        this.currency = currency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getZoneId() {
        return zoneId;
    }

    public void setZoneId(Long zoneId) {
        this.zoneId = zoneId;
    }

    public String getZoneName() {
        return zoneName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public Double getChargingFeePerKwh() {
        return chargingFeePerKwh;
    }

    public void setChargingFeePerKwh(Double chargingFeePerKwh) {
        this.chargingFeePerKwh = chargingFeePerKwh;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}