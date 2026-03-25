package de.codecentric.spring_modulith_example.reservation.adapter.user;

import de.codecentric.spring_modulith_example.reservation.port.UserClient;

public class FakeUserClient implements UserClient {

    @Override
    public boolean isAuthenticated(String userId) {
        // For now, assume all users are authenticated
        // In real implementation, this would validate JWT token or session
        return userId != null && !userId.isBlank();
    }
}
