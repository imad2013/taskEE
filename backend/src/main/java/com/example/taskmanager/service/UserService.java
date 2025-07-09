package com.example.taskmanager.service;

import com.example.taskmanager.model.User;
import com.example.taskmanager.model.Role;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
@Transactional
public class UserService {
    @PersistenceContext
    private EntityManager em;

    public User authenticate(String username, String password) {
        TypedQuery<User> query = em.createQuery(
            "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        
        try {
            User user = query.getSingleResult();
            if (password.equals(user.getPassword())) { // In production, use proper password hashing
                return user;
            }
        } catch (Exception e) {
            // User not found or other error
        }
        return null;
    }

    public User createUser(String username, String password, String roleName) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // In production, hash the password
        
        Set<Role> roles = new HashSet<>();
        Role role = findOrCreateRole(roleName);
        roles.add(role);
        user.setRoles(roles);
        
        em.persist(user);
        return user;
    }

    private Role findOrCreateRole(String roleName) {
        TypedQuery<Role> query = em.createQuery(
            "SELECT r FROM Role r WHERE r.name = :name", Role.class);
        query.setParameter("name", roleName);
        
        try {
            return query.getSingleResult();
        } catch (Exception e) {
            Role role = new Role();
            role.setName(roleName);
            em.persist(role);
            return role;
        }
    }

    public String getRolesAsString(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .reduce("", (a, b) -> a + "," + b)
                .replaceFirst(",", "");
    }
} 