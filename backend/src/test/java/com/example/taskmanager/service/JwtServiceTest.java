package com.example.taskmanager.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_ROLES = "USER,ADMIN";

    @BeforeEach
    void setUp() {
        // Set up JWT secret for testing
        System.setProperty("JWT_SECRET", "test-secret-key-for-jwt-signing-and-verification");
    }

    @Test
    void generateToken_ValidData_ReturnsValidToken() {
        // Act
        String token = jwtService.generateToken(TEST_USERNAME, TEST_ROLES);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Verify token can be parsed (basic validation)
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void generateToken_DifferentUsers_ReturnsDifferentTokens() {
        // Act
        String token1 = jwtService.generateToken("user1", "USER");
        String token2 = jwtService.generateToken("user2", "ADMIN");

        // Assert
        assertNotEquals(token1, token2);
    }

    @Test
    void validateToken_ValidToken_ReturnsClaims() {
        // Arrange
        String token = jwtService.generateToken(TEST_USERNAME, TEST_ROLES);

        // Act
        Claims claims = jwtService.validateToken(token);

        // Assert
        assertNotNull(claims);
        assertEquals(TEST_USERNAME, claims.getSubject());
        assertEquals(TEST_ROLES, claims.get("roles", String.class));
    }

    @Test
    void validateToken_InvalidToken_ThrowsException() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act & Assert
        assertThrows(RuntimeException.class, () -> jwtService.validateToken(invalidToken));
    }

    @Test
    void getUsernameFromToken_ValidToken_ReturnsUsername() {
        // Arrange
        String token = jwtService.generateToken(TEST_USERNAME, TEST_ROLES);

        // Act
        String username = jwtService.getUsernameFromToken(token);

        // Assert
        assertEquals(TEST_USERNAME, username);
    }

    @Test
    void getRolesFromToken_ValidToken_ReturnsRoles() {
        // Arrange
        String token = jwtService.generateToken(TEST_USERNAME, TEST_ROLES);

        // Act
        String roles = jwtService.getRolesFromToken(token);

        // Assert
        assertEquals(TEST_ROLES, roles);
    }

    @Test
    void generateToken_EmptyUsername_ThrowsException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> jwtService.generateToken("", TEST_ROLES));
    }

    @Test
    void generateToken_NullUsername_ThrowsException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> jwtService.generateToken(null, TEST_ROLES));
    }
} 