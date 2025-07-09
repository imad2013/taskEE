package com.example.taskmanager.web;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.web.TaskWebSocket;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Path("/api/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Transactional
public class TaskResource {
    @PersistenceContext
    private EntityManager em;

    @GET
    @RolesAllowed({"USER", "MANAGER", "ADMIN"})
    public Response getAllTasks() {
        TypedQuery<Task> query = em.createQuery("SELECT t FROM Task t", Task.class);
        List<Task> tasks = query.getResultList();
        return Response.ok(tasks).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"USER", "MANAGER", "ADMIN"})
    public Response getTask(@PathParam("id") Long id) {
        Task task = em.find(Task.class, id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(task).build();
    }

    @POST
    @RolesAllowed({"MANAGER", "ADMIN"})
    public Response createTask(Task task) {
        em.persist(task);
        em.flush();
        
        // Broadcast to WebSocket
        Map<String, Object> message = new HashMap<>();
        message.put("type", "TASK_CREATED");
        message.put("task", task);
        TaskWebSocket.broadcast(message.toString());
        
        return Response.status(Response.Status.CREATED).entity(task).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"MANAGER", "ADMIN"})
    public Response updateTask(@PathParam("id") Long id, Task task) {
        Task existingTask = em.find(Task.class, id);
        if (existingTask == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setStatus(task.getStatus());
        existingTask.setAssignedTo(task.getAssignedTo());
        existingTask.setProject(task.getProject());
        
        em.merge(existingTask);
        
        // Broadcast to WebSocket
        Map<String, Object> message = new HashMap<>();
        message.put("type", "TASK_UPDATED");
        message.put("task", existingTask);
        TaskWebSocket.broadcast(message.toString());
        
        return Response.ok(existingTask).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public Response deleteTask(@PathParam("id") Long id) {
        Task task = em.find(Task.class, id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        em.remove(task);
        
        // Broadcast to WebSocket
        Map<String, Object> message = new HashMap<>();
        message.put("type", "TASK_DELETED");
        message.put("taskId", id);
        TaskWebSocket.broadcast(message.toString());
        
        return Response.noContent().build();
    }
} 