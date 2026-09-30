package dh13c8.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class JwtUtil {

    private static final String SECRET_KEY = "khachsanmicroservicesecretkeyforajwttokengenerationandbcryptencryption123456789";
    private static final long EXPIRATION_TIME = 86400000;
    private static final long REFRESH_EXPIRATION_TIME = 604800000;

    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public static String generateToken(Long userId, String email, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        claims.put("userType", userType);
        return createToken(claims, email, EXPIRATION_TIME);
    }

    public static String generateRefreshToken(Long userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        return createToken(claims, email, REFRESH_EXPIRATION_TIME);
    }

    private static String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        long now = System.currentTimeMillis();
        Date issuedAt = new Date(now);
        Date expiresAt = new Date(now + expirationTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(issuedAt)
                .setExpiration(expiresAt)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public static Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith((javax.crypto.SecretKey) key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("Error extracting claims from token: {}", e.getMessage());
            return null;
        }
    }

    public static String extractEmail(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public static Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        if (claims != null && claims.containsKey("userId")) {
            return claims.get("userId", Long.class);
        }
        return null;
    }

    public static String extractUserType(String token) {
        Claims claims = extractAllClaims(token);
        if (claims != null && claims.containsKey("userType")) {
            return claims.get("userType", String.class);
        }
        return null;
    }

    public static boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims != null && !isTokenExpired(claims.getExpiration());
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private static boolean isTokenExpired(Date expiration) {
        return expiration.before(new Date());
    }

    public static long getExpirationTime() {
        return EXPIRATION_TIME;
    }
}
