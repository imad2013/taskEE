package com.example.taskmanager.web;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;
import com.example.taskmanager.model.User;
import com.example.taskmanager.service.UserService;
import com.example.taskmanager.service.JwtService;
import java.util.Map;
import java.util.HashMap;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    @Inject
    private UserService userService;
    
    @Inject
    private JwtService jwtService;

    @POST
    @Path("/login")
    public Response login(Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Username and password are required"))
                    .build();
        }
        
        User user = userService.authenticate(username, password);
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Invalid credentials"))
                    .build();
        }
        
        String roles = userService.getRolesAsString(user);
        String token = jwtService.generateToken(username, roles);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", username);
        response.put("roles", roles);
        
        return Response.ok(response).build();
    }

    @POST
    @Path("/register")
    public Response register(Map<String, String> userData) {
        String username = userData.get("username");
        String password = userData.get("password");
        String role = userData.getOrDefault("role", "USER");
        
        if (username == null || password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Username and password are required"))
                    .build();
        }
        
        try {
            User user = userService.createUser(username, password, role);
            return Response.status(Response.Status.CREATED)
                    .entity(Map.of("message", "User created successfully", "username", username))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Failed to create user: " + e.getMessage()))
                    .build();
        }
    }
} 