package com.example.taskmanager.web;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import com.example.taskmanager.model.Project;
import java.util.List;

@Path("/api/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Transactional
public class ProjectResource {
    @PersistenceContext
    private EntityManager em;

    @GET
    @RolesAllowed({"USER", "MANAGER", "ADMIN"})
    public Response getAllProjects() {
        TypedQuery<Project> query = em.createQuery("SELECT p FROM Project p", Project.class);
        List<Project> projects = query.getResultList();
        return Response.ok(projects).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"USER", "MANAGER", "ADMIN"})
    public Response getProject(@PathParam("id") Long id) {
        Project project = em.find(Project.class, id);
        if (project == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(project).build();
    }

    @POST
    @RolesAllowed({"MANAGER", "ADMIN"})
    public Response createProject(Project project) {
        em.persist(project);
        em.flush();
        return Response.status(Response.Status.CREATED).entity(project).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"MANAGER", "ADMIN"})
    public Response updateProject(@PathParam("id") Long id, Project project) {
        Project existingProject = em.find(Project.class, id);
        if (existingProject == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        
        em.merge(existingProject);
        return Response.ok(existingProject).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public Response deleteProject(@PathParam("id") Long id) {
        Project project = em.find(Project.class, id);
        if (project == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        em.remove(project);
        return Response.noContent().build();
    }
} 