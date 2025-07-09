package com.example.taskmanager.service;

import com.example.taskmanager.model.User;
import com.example.taskmanager.model.Role;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.NoResultException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private TypedQuery<User> userQuery;

    @Mock
    private TypedQuery<Role> roleQuery;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        testRole = new Role();
        testRole.setId(1L);
        testRole.setName("USER");

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        Set<Role> roles = new HashSet<>();
        roles.add(testRole);
        testUser.setRoles(roles);
    }

    @Test
    void authenticate_ValidCredentials_ReturnsUser() {
        // Arrange
        when(entityManager.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
        when(userQuery.setParameter(anyString(), any())).thenReturn(userQuery);
        when(userQuery.getSingleResult()).thenReturn(testUser);

        // Act
        User result = userService.authenticate("testuser", "password123");

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("password123", result.getPassword());
        verify(entityManager).createQuery("SELECT u FROM User u WHERE u.username = :username", User.class);
        verify(userQuery).setParameter("username", "testuser");
    }

    @Test
    void authenticate_InvalidPassword_ReturnsNull() {
        // Arrange
        when(entityManager.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
        when(userQuery.setParameter(anyString(), any())).thenReturn(userQuery);
        when(userQuery.getSingleResult()).thenReturn(testUser);

        // Act
        User result = userService.authenticate("testuser", "wrongpassword");

        // Assert
        assertNull(result);
    }

    @Test
    void authenticate_UserNotFound_ReturnsNull() {
        // Arrange
        when(entityManager.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
        when(userQuery.setParameter(anyString(), any())).thenReturn(userQuery);
        when(userQuery.getSingleResult()).thenThrow(new NoResultException());

        // Act
        User result = userService.authenticate("nonexistent", "password123");

        // Assert
        assertNull(result);
    }

    @Test
    void createUser_ValidData_CreatesUserSuccessfully() {
        // Arrange
        when(entityManager.createQuery(anyString(), eq(Role.class))).thenReturn(roleQuery);
        when(roleQuery.setParameter(anyString(), any())).thenReturn(roleQuery);
        when(roleQuery.getSingleResult()).thenReturn(testRole);

        // Act
        User result = userService.createUser("newuser", "newpassword", "USER");

        // Assert
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertEquals("newpassword", result.getPassword());
        assertTrue(result.getRoles().contains(testRole));
        verify(entityManager).persist(result);
    }

    @Test
    void createUser_RoleNotFound_CreatesNewRole() {
        // Arrange
        when(entityManager.createQuery(anyString(), eq(Role.class))).thenReturn(roleQuery);
        when(roleQuery.setParameter(anyString(), any())).thenReturn(roleQuery);
        when(roleQuery.getSingleResult()).thenThrow(new NoResultException());

        // Act
        User result = userService.createUser("newuser", "newpassword", "ADMIN");

        // Assert
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertEquals("newpassword", result.getPassword());
        assertEquals(1, result.getRoles().size());
        verify(entityManager, times(2)).persist(any()); // User and new Role
    }

    @Test
    void getRolesAsString_SingleRole_ReturnsRoleName() {
        // Act
        String result = userService.getRolesAsString(testUser);

        // Assert
        assertEquals("USER", result);
    }

    @Test
    void getRolesAsString_MultipleRoles_ReturnsCommaSeparatedRoles() {
        // Arrange
        Role adminRole = new Role();
        adminRole.setName("ADMIN");
        testUser.getRoles().add(adminRole);

        // Act
        String result = userService.getRolesAsString(testUser);

        // Assert
        assertTrue(result.contains("USER"));
        assertTrue(result.contains("ADMIN"));
        assertTrue(result.contains(","));
    }

    @Test
    void getRolesAsString_NoRoles_ReturnsEmptyString() {
        // Arrange
        testUser.setRoles(new HashSet<>());

        // Act
        String result = userService.getRolesAsString(testUser);

        // Assert
        assertEquals("", result);
    }
} 