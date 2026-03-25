package de.codecentric.spring_modulith_example.user.nested_modules.auth.jwt;

import de.codecentric.spring_modulith_example.user.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {
    private final String jwtSecret;
    private final long jwtExpirationMillis;

    public JwtService(
        @Value("${app.security.jwt.secret}") String jwtSecret,
        @Value("${app.security.jwt.expiration-millis:3600000}") long jwtExpirationMillis
    ) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMillis = jwtExpirationMillis;
    }

    public String generateToken(User user) {
        var now = Instant.now();
        var expiration = now.plusMillis(jwtExpirationMillis);

        return Jwts.builder()
            .subject(user.getEmail())
            .claim("role", user.getRole().name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(getSigningKey())
            .compact();
    }

    private SecretKey getSigningKey() {
        var keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
