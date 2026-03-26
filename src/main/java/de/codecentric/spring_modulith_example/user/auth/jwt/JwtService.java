package de.codecentric.spring_modulith_example.user.auth.jwt;

import de.codecentric.spring_modulith_example.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.function.Function;

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

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, String expectedEmail) {
        var email = extractEmail(token);
        return expectedEmail.equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        var claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return resolver.apply(claims);
    }

    private SecretKey getSigningKey() {
        var keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
