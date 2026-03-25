package de.codecentric.spring_modulith_example.billing.dto;

public class InvoiceRequest {

    private Long reservationId;
    private Long userId;
    private String userName;
    private String spaceName;
    private String zoneName;
    private Double parkingHours;
    private Double chargingKwh;
    private Double pricePerHour;
    private Double chargingFeePerKwh;

    public InvoiceRequest() {
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSpaceName() {
        return spaceName;
    }

    public void setSpaceName(String spaceName) {
        this.spaceName = spaceName;
    }

    public String getZoneName() {
        return zoneName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public Double getParkingHours() {
        return parkingHours;
    }

    public void setParkingHours(Double parkingHours) {
        this.parkingHours = parkingHours;
    }

    public Double getChargingKwh() {
        return chargingKwh;
    }

    public void setChargingKwh(Double chargingKwh) {
        this.chargingKwh = chargingKwh;
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
}