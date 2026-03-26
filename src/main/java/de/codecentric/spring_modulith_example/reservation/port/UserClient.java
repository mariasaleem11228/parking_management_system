package de.codecentric.spring_modulith_example.reservation.port;

public interface UserClient {

    boolean isAuthenticated(String userId);
}
