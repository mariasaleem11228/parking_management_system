package de.codecentric.spring_modulith_example.reservation.port;

public record LockResult(boolean success, String zoneId) {}