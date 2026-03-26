package de.codecentric.spring_modulith_example.reservation.port;

public interface IUserClient {

    boolean isAuthenticated(String userId);
}
