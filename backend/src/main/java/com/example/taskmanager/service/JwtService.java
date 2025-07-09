package com.example.taskmanager.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.enterprise.context.ApplicationScoped;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class JwtService {
    private static final String SECRET_KEY = "your-secret-key-here-make-it-long-and-secure-in-production";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(String username, String roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    public String getUsernameFromToken(String token) {
        return validateToken(token).getSubject();
    }

    public String getRolesFromToken(String token) {
        return validateToken(token).get("roles", String.class);
    }
} 